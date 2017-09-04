const requireDirectory = require('require-directory');

const dots = require('../dots');
const util = require('../util');

const generate = {};
const shared = { dots, generate, util };

const generators = requireDirectory(module);
Object.keys(generators).forEach((key) => {
  generate[util.lowCam(key)] = generators[key](shared);
});

module.exports = generate;
