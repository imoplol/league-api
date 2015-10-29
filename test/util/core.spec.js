/**
 * util/core.spec.js
 *
 * @author  Rock Hu <rockia@mac.com>
 * @license MIT
 */
 import Endpoints    from '../../src/config/endpoints.json';
 import API          from '../../src/config/api.json';


var Sinon           = require('sinon');
var Chai            = require('chai');
var Path            = require('path');
var urlBuilder      = require('../../src/util/url-builder.js');

Chai.use(require('sinon-chai'));
Chai.should();

var expect         = Chai.expect;

describe('utils', function() {
  it('should build correct url', function() {
    var region = 'NA';
    var name = 'summoner-info';
    var params = {summonerName: 'Mamoritai'};
    var URLParams = '';
    var result = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/Mamoritai";
    expect(urlBuilder(Endpoints, API, region, name, params, URLParams)[0]).equal(result);
  });
});
