const camelize = require('camelize');
const fs = require('fs');

const moduleName = metadata => (
  (metadata.serviceAbbreviation || metadata.serviceFullName)
    .replace(/^(AWS|Amazon)/, '')
    .replace(/[^a-z0-9]/ig, '')
);

const touchDir = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

const unique = array => Array.from(new Set(array));

const lowCam = (x) => {
  const y = camelize(x);
  return y.length ? y[0].toLowerCase() + y.slice(1) : '';
};

const upCam = (x) => {
  const y = camelize(x);
  return y.length ? y[0].toUpperCase() + y.slice(1) : '';
};

const safeIdentifier = x => x
  .replace(/[^a-z0-9_]+/ig, '_')
  .replace(/^(type|port)$/, '$1_')
  ;

module.exports = {
  camelize,
  identity: x => x,
  lowCam,
  moduleName,
  safeIdentifier,
  touchDir,
  unique,
  upCam,
};
