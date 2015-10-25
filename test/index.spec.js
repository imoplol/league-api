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
    it('should return APIDriver Object', function(){

      var options = {
        api_key: '1234',
        platform: 'production',
        region: 'NA'
      }
      class APIDriver{};
      var apidriverObj      = new APIDriver(Endpoints,API,options);
      expect(apidriverObj).to.be.an.instanceof(APIDriver);
    });
});

describe('Util', function() {
    require('./util/core.spec.js');
});
