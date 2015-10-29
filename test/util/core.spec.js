/**
 * util/core.spec.js
 *
 * @author  Rock Hu <rockia@mac.com>
 * @license MIT
 */
 var Endpoints    = require('../../src/config/endpoints.json');
 var API          = require('../../src/config/api.json');


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

    it('should return correct url with 1 URLParam', function(){
        var region = 'NA';
        var name = 'summoner-info';
        var params = {summonerName: 'Mamoritai'};
        var URLParams = ["test"];
        var result = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/Mamoritai?test";
        expect(urlBuilder(Endpoints, API, region, name, params, URLParams)[0]).equal(result);
    });

    it('should return correct url with 2 or more URLParams', function(){
        var region = 'NA';
        var name = 'summoner-info';
        var params = {summonerName: 'Mamoritai'};
        var URLParams = ["latest","clean"];
        var result = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/Mamoritai?latest&clean";
        expect(urlBuilder(Endpoints, API, region, name, params, URLParams)[0]).equal(result);
    });

    it('it should return undefined if passed wrong param', function(){
        var region = 'NA';
        var name = 'summoner-info';
        var params = {summoner: 'summoner'};
        var URLParams = '';
        expect(urlBuilder(Endpoints, API, region, name, params, URLParams)[0]).equal(undefined);
    });


    it('should return failed regex test', function(){
        var region = 'NA';
        var name = 'summoner-info';
        var params = {summoner: '*'};
        var URLParams = '';
        expect(urlBuilder(Endpoints, API, region, name, params, URLParams)[0]).equal(undefined);
    });
});
