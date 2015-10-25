/**
 * test/index.spec.js
 *
 * @author  Rock Hu <rockia@mac.com>
 * @license MIT
 */

 import Endpoints    from '../src/config/endpoints.json';
 import API          from '../src/config/api.json';

var Chai           = require('chai');
Chai.use(require('sinon-chai'));
Chai.use(require('chai-as-promised'));
Chai.should();
var expect         = Chai.expect;

describe('Index', function(){
    require('./index/core.spec.js');
});

describe('Util', function() {
    require('./util/core.spec.js');
});
