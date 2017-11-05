#!/usr/bin/env node

const co = require('co');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const {
  formatElmFiles,
  generate,
  sourceApi,
} = require('../src');
const { moduleName, touchDir } = require('../src/util');

// eslint-disable-next-line no-unused-expressions
const { argv } = yargs
  .option('name', {
    describe: 'name of the service to generate',
    required: true,
  })
  .option('json-root', {
    describe: 'folder that contains API JSON files',
    default: 'api',
  })
  .option('elm-root', {
    describe: 'folder that contains generated Elm files',
    default: 'src',
  })
  .option('refresh', {
    describe: 'refresh with the latest API JSON files',
    alias: 'r',
    default: false,
  })
  .option('format', {
    describe: 'do not run elm-format after generating',
    default: true,
  })
  .help();

const {
  name,
  refresh,
  format,
} = argv;
const root = argv['json-root'];
const elmRoot = argv['elm-root'];
const issue = 'Please open an issue on https://github.com/ktonon/elm-aws-generate';

co(function* () {
  yield sourceApi.download(name, { root, refresh });
  const source = sourceApi.findLatest(name, { root });

  if (!source) {
    console.error(`Could not find source JSON file for "${name}".
Try again with the --refresh option.
If that does not help, make sure a service exists with the given name.
See https://github.com/aws/aws-sdk-js/tree/master/apis for available services.`);
    process.exit(1);
  }

  const { protocol, signatureVersion } = source.metadata;

  if (source.version !== '2.0') {
    console.error(`Unsupported source version: ${source.version}.\n${issue}`);
    process.exit(1);
  }

  if (signatureVersion !== 'v4') {
    console.error(`Unsupported signature version "${signatureVersion}"\n${issue}`);
    process.exit(1);
  }

  if (['query', 'json'].indexOf(protocol) === -1) {
    console.error(`Unsupported protocol: ${protocol}.\n${issue}`);
    process.exit(1);
  }


  touchDir(elmRoot);
  touchDir(path.join(elmRoot, 'AWS'));
  touchDir('tests');

  const mod = moduleName(source.metadata);
  fs.writeFileSync(
    path.join(elmRoot, 'AWS', `${mod}.elm`),
    generate.service(source));

  if (fs.existsSync('elm-package.json')) {
    const elmPackage = JSON.parse(fs.readFileSync('elm-package.json').toString());
    elmPackage['exposed-modules'].push(`AWS.${mod}`);
    fs.writeFileSync('elm-package.json', JSON.stringify(elmPackage, null, 4));
  } else {
    fs.writeFileSync('elm-package.json', generate.elmPackage(source.metadata));
  }

  if (format) {
    formatElmFiles();
  }
})
.catch((err) => {
  console.error(err);
  process.exit(1);
});
