const co = require('co');
const fs = require('fs');
const path = require('path');
const { generate, sourceApi } = require('../../src');
const { touchDir } = require('../../src/util');

const gen = generate.service;

const root = path.join(__dirname, '..', '..', 'sandbox', 'api');

describe('generate.service(source)', () => {
  before(function hook() {
    this.timeout(10000);
    return co(function* () {
      touchDir(path.join(root, '..'));
      yield sourceApi.download('acm', { root });
    });
  });

  it('does not crash', () => {
    const source = JSON.parse(fs.readFileSync(path.join(root, 'acm-2015-12-08.normal.json')));
    (() => gen(source)).should.not.throw();
  });
});
