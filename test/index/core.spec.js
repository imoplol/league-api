/**
 * util/core.spec.js
 *
 * @author  Rock Hu <rockia@mac.com>
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
const API          = dofile('lib/config/api.json');
const APIDriver    = dofile('lib/index.js');
const Endpoints    = dofile('lib/config/endpoints.json');

const options = {
  api_key: '1234',
  platform: 'production',
  region: 'NA'
};

describe('index', function() {


  it('should return APIDriver Object', function() {
    const apidriverObj = new APIDriver(Endpoints, API, options);
    expect(apidriverObj).to.be.an.instanceof(APIDriver);
  });

  it('should should fail when calling APIDriver as function', function() {
    const params = {
      api_key: '1234',
      platform: 'production',
      region: 'NA'
    };
    expect(APIDriver.bind(Endpoints, API, params)).to.throw();
  });

  it('should load modules', function() {
    const apidriverObj = new APIDriver(Endpoints, API, options);
    apidriverObj.loadModule(__dirname + '/../../lib/modules/legacy.js');
  });

  it('should call api with result', co(function*() {
    const driver = new APIDriver(Endpoints,
      API, {
        api_key: 'b1d29328-72ca-4d03-b9e2-be254f4379d6',
        region: 'NA',
        platform: 'development',
        urlParams: { }
      }
    );
    const result = yield driver.module('legacy', {
      action: 'summoner-info',
      params: {
        summonerName: 'Mamoritai'
      }
    });
    expect(result).to.exist;
  }));

  it('should fail with unexpected module', function() {
    const driver = new APIDriver(Endpoints,
      API, {
        api_key: 'b1d29328-72ca-4d03-b9e2-be254f4379d6',
        region: 'NA',
        platform: 'development',
        urlParams: { }
      }
    );
    const promise = driver.module('not a module', {
      action: 'summoner-info',
      params: {
        summonerName: 'Mamoritai'
      }
    });
    expect(promise).to.be.rejected;
  });

  it('should fail with unexpected action', function() {
    const driver = new APIDriver(Endpoints,
      API, {
        api_key: 'b1d29328-72ca-4d03-b9e2-be254f4379d6',
        region: 'NA',
        platform: 'development',
        urlParams: { }
      }
    );
    const promise = driver.module('legacy', {
      action: 'not an action',
      params: {
        summonerName: 'Mamoritai'
      }
    });

    expect(promise).to.be.rejected;
  });

  it('should call with urlparams', co(function*() {
    const driver = new APIDriver(Endpoints,
      API, {
        api_key: 'b1d29328-72ca-4d03-b9e2-be254f4379d6',
        region: 'NA',
        platform: 'development',
        urlParams: { }
      }
    );
    const result = yield driver.module('legacy', {
      action: 'match-info',
      params: {
        matchId: 1965880269
      },
      urlParams: {
        includeTimeline: true
      }
    });

    expect(result)
      .to.have.property('matchId', 1965880269);
  }));


});
