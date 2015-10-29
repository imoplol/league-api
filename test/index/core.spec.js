/**
 * util/core.spec.js
 *
 * @author  Rock Hu <rockia@mac.com>
 * @license MIT
 */
 import Endpoints    from '../../src/config/endpoints.json';
 import API          from '../../src/config/api.json';
 import APIDriver    from '../../src/index.js';


var Sinon           = require('sinon');
var Chai            = require('chai');
var Path            = require('path');

Chai.use(require('sinon-chai'));
Chai.use(require('chai-as-promised'));
Chai.should();

var expect         = Chai.expect;
var index      = require('../../src/index.js');

var options = {
    api_key: '1234',
    platform: 'production',
    region: 'NA'
};

let TAG = 'test';

describe('index', function() {
    it('should return APIDriver Object', function(){
        var apidriverObj      = new APIDriver(Endpoints,API,options);
        expect(apidriverObj).to.be.an.instanceof(APIDriver);
    });

    it('should should fail when calling APIDriver as function', function(){
        var options = {
            api_key: '1234',
            platform: 'production',
            region: 'NA'
        };
        expect(APIDriver.bind(Endpoints,API,options)).to.throw();
    });

    it('loggers should be a function', function(){
        var apidriverObj      = new APIDriver(Endpoints,API,options);
        apidriverObj.log.verbose(TAG, 'test verbose');
        apidriverObj.log.info(TAG, 'test info');
        apidriverObj.log.warn(TAG, 'test warn');
        apidriverObj.log.error(TAG, 'test error');
    });

    it('should load modules', function(){
        var apidriverObj      = new APIDriver(Endpoints,API,options);
        apidriverObj.loadModule(__dirname + '/../../src/modules/legacy.js');
    });

    it('should call api with result', function(done){
        var driver = new APIDriver(Endpoints,
            API,
            {
                api_key: 'b1d29328-72ca-4d03-b9e2-be254f4379d6',
                region: 'NA',
                platform: 'development',
                urlParams: [ ]
            }
        );
        driver.module("legacy", {action: 'summoner-info', params: {summonerName: 'Mamoritai'}}).should.to.be.fulfilled.then(function (result) {
            result.should.exist;
        }).should.notify(done);
    });

    it('should fail with unexpected module', function(done){
        var driver = new APIDriver(Endpoints,
            API,
            {
                api_key: 'b1d29328-72ca-4d03-b9e2-be254f4379d6',
                region: 'NA',
                platform: 'development',
                urlParams: [ ]
            }
        );
        driver.module("not a module", {action: 'summoner-info', params: {summonerName: 'Mamoritai'}}).should.to.be.rejected.and.notify(done);
    });

    it('should fail with unexpected action', function(done){
        var driver = new APIDriver(Endpoints,
            API,
            {
                api_key: 'b1d29328-72ca-4d03-b9e2-be254f4379d6',
                region: 'NA',
                platform: 'development',
                urlParams: [ ]
            }
        );
        driver.module("legacy", {action: 'not an action', params: {summonerName: 'Mamoritai'}}).should.to.be.rejected.and.notify(done);
    });


});
