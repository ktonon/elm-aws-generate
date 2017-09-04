const { lowCam, upCam, identity } = require('../util');

const EXTRAS = [
  'jsonVersion',
  'signingName',
  'targetPrefix',
  'timestampFormat',
  'xmlNamespace',
];

const renderExtra = ([key, value]) => {
  const funcname = `AWS.Core.Service.set${upCam(key)}`;
  return key === 'timestampFormat'
    ? `${funcname} AWS.Core.Service.${value}`
    : `${funcname} "${value}"`;
};

const generateService = ({ dots }) => (metadata) => {
  const it = Object.assign({}, metadata);

  it.isRegional = !it.globalEndpoint;

  it.protocol = lowCam(it.protocol);

  it.signer = `sign${it.signatureVersion.toUpperCase()}`;

  const extras = EXTRAS
    .map(key => (metadata[key] ? [key, metadata[key]] : null))
    .filter(identity);

  it.extra = extras.length === 0
    ? 'identity'
    : `(${extras.map(renderExtra).join(' >> ')})`;

  return dots.defineService(it);
};

module.exports = generateService;
