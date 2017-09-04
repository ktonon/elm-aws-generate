const AdmZip = require('adm-zip');
const binaryParser = require('superagent-binary-parser');
const request = require('superagent');
const fs = require('fs');
const path = require('path');
require('superagent-as-promised')(request);

function* download(serviceName, { root = 'api', refresh } = {}) {
  const apiPattern = (name = '[^/]+?') => new RegExp(`/(${name}-.*?\\.json)$`, 'i');
  const rootExists = fs.existsSync(root);

  const existingJsonFiles = (rootExists ? fs.readdirSync(root) : [])
    .filter(name => apiPattern(serviceName).test(`/${name}`));

  if (existingJsonFiles.length > 0 && !refresh) {
    return;
  }

  const res = yield request
    .get('https://api.github.com/repos/aws/aws-sdk-js/releases')
    .endAsync();

  const [release] = res.body;
  console.log(`Downloading ${release.name}...`);

  const { body } = yield request
    .get(release.zipball_url)
    .parse(binaryParser)
    .buffer()
    .endAsync();

  console.log(`Extracting JSON API files to ${root}...`);
  const zip = new AdmZip(body);

  if (!rootExists) {
    fs.mkdirSync(root);
  }
  existingJsonFiles.forEach(name => fs.unlinkSync(path.join(root, name)));

  zip
    .getEntries()
    .forEach((e) => {
      const match = e.entryName.match(apiPattern());
      if (match) {
        fs.writeFileSync(`${root}/${match[1]}`, e.getData().toString('utf8'));
      }
    });
}

module.exports = download;
