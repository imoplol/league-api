/**
 * sample.js
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

import APIDriver from './index';
import Endpoints from './config/endpoints.json';
import API from './config/api.json';

const driver = new APIDriver(Endpoints,
  API, {
    api_key: 'b1d29328-72ca-4d03-b9e2-be254f4379d6',
    region: 'NA',
    platform: 'development',
    urlParams: []
  }
);

function callapi() {
  driver.module('legacy', {
    action: 'summoner-info',
    params: {
      summonerName: 'Mamoritai'
    }
  }).then(function() {
  }).catch((e) => {
    console.error(e);
  });
}
setInterval(callapi, 1000);
