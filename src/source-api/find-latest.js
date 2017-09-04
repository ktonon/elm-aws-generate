const fs = require('fs');
const path = require('path');

module.exports = (serviceName, { root = 'api' } = {}) => {
  const filenamePattern = new RegExp(`^${serviceName}-(\\d{4}-\\d{2}-\\d{2})\\.normal\\.json$`, 'i');
  let source;

  fs.readdirSync(root)
    .forEach((filename) => {
      const m = filename.match(filenamePattern);
      if (m) {
        const version = Date.parse(m[1]);
        if (!source || source.version < version) {
          source = { filename, version };
        }
      }
    });

  return source && JSON.parse(fs.readFileSync(path.join(root, source.filename)));
};
