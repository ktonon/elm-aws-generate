const AdmZip = require('adm-zip');
const binaryParser = require('superagent-binary-parser');
const request = require('superagent');
const fs = require('fs');
const path = require('path');
require('superagent-as-promised')(request);

function* downloadApi({ serviceName, outputDir, refresh } = {}) {
  const apiPattern = new RegExp(`/(${serviceName}-.*?\\.json)$`, 'i');
  const outputDirExists = fs.existsSync(outputDir);

  const existingJsonFiles = (outputDirExists ? fs.readdirSync(outputDir) : [])
    .filter(name => apiPattern.test(`/${name}`));

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

  console.log(`Extracting ${serviceName} to ${outputDir}...`);
  const zip = new AdmZip(body);

  if (!outputDirExists) {
    fs.mkdirSync(outputDir);
  }
  existingJsonFiles.forEach(name => fs.unlinkSync(path.join(outputDir, name)));

  zip
    .getEntries()
    .forEach((e) => {
      const match = e.entryName.match(apiPattern);
      if (match) {
        fs.writeFileSync(`${outputDir}/${match[1]}`, e.getData().toString('utf8'));
      }
    });
}

module.exports = downloadApi;
