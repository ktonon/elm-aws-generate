const { lowCam, upCam, moduleName, unique } = require('../util');
const replacePathParams = require('../replace-path-params');
const resolveTypes = require('../resolve-types');

const findIOShapes = (ops, io) =>
  Object.keys(ops).map((key) => {
    const op = ops[key];
    return op[io] && upCam(op[io].shape);
  }).filter(x => x);

module.exports = ({ dots, generate }) => (data) => {
  const types = resolveTypes(data.shapes, {
    inputShapes: findIOShapes(data.operations, 'input'),
    outputShapes: findIOShapes(data.operations, 'output'),
  });
  const mod = moduleName(data.metadata);
  console.log(`Generating ${mod}...`);

  const sumExtraImports = types.reduce((acc, t) => acc.concat(t.extraImports || []), []);

  const operations = Object.keys(data.operations)
    .map((key) => {
      const op = data.operations[key];
      const params = op.input
        ? types.findByShape(op.input.shape).members
        : [];
      const requiredParams = params.filter(m => m.required);
      const optionalParams = params.filter(m => !m.required);
      const { requestPath, extraImports, unusedParams } =
        replacePathParams(op.http.requestUri, requiredParams);
      (extraImports || []).forEach(extraImport => sumExtraImports.push(extraImport));

      if (!op.http) {
        throw new Error(`${mod}: ${key} doesn't have an http attribute!`);
      }
      return {
        name: lowCam(key),
        actionName: upCam(key),
        protocol: data.metadata.protocol,
        optionsName: `${key}Options`,
        doc: op.documentation,
        http: op.http,
        requestPath,
        requiredParams,
        requiredUnusedParams: unusedParams,
        optionalParams,
        input: op.input && types.findByShape(op.input.shape),
        output: op.output
          ? types.findByShape(op.output.shape)
          : {
            type: '()',
            decoder: '(JD.succeed ())',
          },
        outputResultWrapper: op.output
          ? op.output.resultWrapper || op.output.shape
          : '()',
        errors: op.errors,
      };
    });

  const categories = [
    'response',
    'record',
    'union',
    'exception',
  ].map(key => ({
    key,
    name: `${upCam(key)}s`,
    types: types.filter(t => t.category === key),
  })).filter(c => c.types.length > 0);

  const it = {
    categories,
    documentation: data.documentation,
    extraImports: unique(sumExtraImports),
    metadata: data.metadata,
    mod,
    operationNames: operations.reduce((acc, op) =>
      acc.concat(op.optionalParams.length
        ? [op.name, op.optionsName]
        : [op.name]),
      []),
    operations: operations.map(dots.defineOperation),
    signatureVersion: `${upCam(data.metadata.signatureVersion)}Signature`,
    serviceDefinition: generate.serviceDefinition(data.metadata),
    types,
  };

  return dots.api(it);
};
