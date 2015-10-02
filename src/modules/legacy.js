/**
 * legacy.js
 * calls Riot's legacy API
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

import  Promise             from 'bluebird';
import  _                   from 'lodash';
import  HTTPClient          from 'request-promise';
import  URLBuilder          from '../util/url-builder';

function module (options, URLParams) {
    return new Promise((resolve, reject) => {
        var urls;
        if(_.includes(this.api.api[this.options.region].supported, options.action)) {
            urls = URLBuilder(this.endpoints, this.api, this.options.region, options.action, options.params, URLParams);
        } else {
            reject({error: 'action not supported in legacy'});
        }

        //  Bad design, need a way to not hard code this
        HTTPClient(urls[0]).then((response) => {
            resolve(response);
        }).catch((e) => { reject(e); });
    });
}

export default {legacy: module};