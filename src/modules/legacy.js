/**
 * legacy.js
 * calls Riot's legacy API
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

import  Promise             from 'bluebird';
import  _                   from 'lodash';
import  URLBuilder          from '../util/url-builder';

function module (options, URLParams) {
    return new Promise((resolve, reject) => {
        var urls;
        if(_.includes(this.api.api[this.options.region].supported, options.action)) {
            urls = URLBuilder(this.endpoints, this.api, this.options.region, options.action, URLParams);
        } else {
            reject({error: 'action not supported in legacy'});
        }
        resolve(urls);
    });
}

export default {legacy: module};