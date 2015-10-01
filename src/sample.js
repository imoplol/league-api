/**
 * sample.js
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

import LeagueDriver from './index';
import Endpoints    from './config/endpoints.json';
import API          from './config/api.json';

var driver = new LeagueDriver(Endpoints,
    API,
    {
        api_key: 'b1d29328-72ca-4d03-b9e2-be254f4379d6',
        region: 'NA',
        platform: 'development',
        urlParams: [ ]
    }
);

console.log('done');

driver.module("legacy", {action: 'champion'});

console.log('done 2');