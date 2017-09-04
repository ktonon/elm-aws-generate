const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const formatLocations = [
  // Running locally during dev of this package
  path.join(__dirname, '..', 'node_modules', '.bin', 'elm-format'),

  // Installed in the npm .bin folder.
  // webpack-dev-server should be along side it
  path.join(__dirname, 'elm-format'),
];

const findFormat = () => formatLocations
  .filter(fs.existsSync)[0];

module.exports = () => {
  const format = findFormat();
  if (!format) {
    console.error(`Unable to find elm-format among:
${formatLocations.join('\n')}`);
    return;
  }
  spawn(format, ['src', '--yes'], {
    cwd: process.cwd(),
    env: process.env,
    stdio: ['ignore', 'ignore', process.stderr],
  });
};
