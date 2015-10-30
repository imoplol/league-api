/**
 * test/index.spec.js
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

const Chai         = require('chai');
Chai.should();
Chai.use(require('sinon-chai'));
Chai.use(require('chai-as-promised'));

/*!
 * Setup global stuff here.
 */
global.co          = require('bluebird').coroutine;
global.expect      = Chai.expect;
global.Sinon       = require('sinon');
global.dofile      = require('app-root-path').require;

/*!
 * Start tests.
 */
describe('Index', function() {
  require('./index/core.spec.js');
});

describe('Util', function() {
  require('./util/core.spec.js');
});
