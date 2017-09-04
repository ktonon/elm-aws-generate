#!/usr/bin/env node

const co = require('co');
const fs = require('fs');
const path = require('path');
const { sourceApi } = require('../src');

const root = 'api';

const f = parts => `| ${parts.join(' | ')} |`;

co(function* () {
  yield sourceApi.download('[^/]+?', { root });
  const sources = fs.readdirSync(root)
    .filter(name => /normal\.json/.test(name))
    .map(name => JSON.parse(fs.readFileSync(path.join(root, name))));

  let metaFields = new Set();
  sources.forEach((source) => {
    Object.keys(source.metadata).forEach(key => metaFields.add(key));
  });
  metaFields = [...metaFields];

  fs.writeFileSync('summary.md', [
    f([''].concat(metaFields)),
    `|${'---|'.repeat(metaFields.length + 1)}`,
  ].concat(sources.map((source) => {
    const { metadata } = source;
    return f([source.version].concat(metaFields.map(key =>
      metadata[key])));
  })).join('\n'));
});
