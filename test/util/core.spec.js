/**
 * util/core.spec.js
 *
 * @author  Rock Hu <rockia@mac.com>
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

const API          = dofile('lib/config/api.json');
const Endpoints    = dofile('lib/config/endpoints.json');
const urlBuilder   = dofile('lib/util/url-builder.js');


describe('utils', function() {
  it('should build correct url', function() {
    const region = 'NA';
    const name = 'summoner-info';
    const params = { summonerName: 'Mamoritai' };
    const query = { };

    const expected = 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/Mamoritai';
    const actual = urlBuilder(Endpoints, API, region, name, params, query)[0];

    expect(actual).equal(expected);
  });

  it('should return correct url with 1 URLParam', function() {
    const region = 'NA';
    const name = 'summoner-info';
    const params = {
      summonerName: 'Mamoritai'
    };
    const URLParams = { foo: 'bar' };
    const result = 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/Mamoritai?foo=bar';
    expect(urlBuilder(Endpoints, API, region, name, params, URLParams)[0]).equal(result);
  });

  it('should return correct url with 2 or more URLParams', function() {
    const region = 'NA';
    const name = 'summoner-info';
    const params = {
      summonerName: 'Mamoritai'
    };
    const URLParams = { foo: 'bar', hello: 'world' };
    const result = 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/Mamoritai?foo=bar&hello=world';
    expect(urlBuilder(Endpoints, API, region, name, params, URLParams)[0]).equal(result);
  });

  it('it should return undefined if passed wrong param', function() {
    const region = 'NA';
    const name = 'summoner-info';
    const params = {
      summoner: 'summoner'
    };
    const URLParams = '';
    expect(urlBuilder(Endpoints, API, region, name, params, URLParams)[0]).equal(undefined);
  });


  it('should return failed regex test', function() {
    const region = 'NA';
    const name = 'summoner-info';
    const params = {
      summoner: '*'
    };
    const URLParams = '';
    expect(urlBuilder(Endpoints, API, region, name, params, URLParams)[0]).equal(undefined);
  });
});
