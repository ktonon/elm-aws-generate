#!/usr/bin/env node

const co = require('co');
const yargs = require('yargs');
const downloadApi = require('../src/download-api');

// eslint-disable-next-line no-unused-expressions
const { argv } = yargs
  .option('name', {
    describe: 'name of the service to generate',
    required: true,
  })
  .option('dir', {
    describe: 'folder that contains API JSON files',
    default: 'api',
  })
  .option('refresh', {
    describe: 'refresh with the latest API JSON files',
    alias: 'r',
    default: false,
  })
  .help();

const {
  name,
  dir,
  refresh,
} = argv;

co(function* () {
  yield downloadApi({ serviceName: name, outputDir: dir, refresh });
});
