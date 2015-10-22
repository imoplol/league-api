/**
 * test/index.spec.js
 *
 * @author  Rock Hu <rockia@mac.com>
 * @license MIT
 */

var Chai           = require('chai');
Chai.use(require('sinon-chai'));
Chai.use(require('chai-as-promised'));
Chai.should();

describe('Util', function() {
    require('./util/core.spec.js');
});
