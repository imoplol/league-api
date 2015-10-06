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

    let TAG = "legacy";

    var urls;
    if(_.includes(this.api.api[this.options.region].supported, options.action)) {
        urls = URLBuilder(this.endpoints, this.api, this.options.region, options.action, options.params, URLParams);
    } else {
        return new Promise((resolve, reject) => {
            reject({error: 'action not supported in legacy'});
        });
    }
    var request = {
        url: urls[0],
        transform: function(body, response) {
            if(response.headers['content-type'].indexOf('application/json') > -1) {
                return JSON.parse(body);
            } else {
                return body;
            }
        }
    };
    return new Promise((resolve, reject) => {
        //  Bad design, need a way to not hard code this
        if(this.api.api[this.options.region].actions[options.action].limitrate) {
            this.bucketM.removeTokens(1).then((remainingTokens) => {
                this.log.verbose(TAG, `removed 1 token, remaining ${remainingTokens}`);
                HTTPClient(request).then((response) => {
                    resolve(response);
                }).catch((e) => {
                    reject(e);
                });
            });
        } else {
            this.log.verbose(TAG, 'skipping rate limiting.');
            HTTPClient(request).then((response) => {
                resolve(response);
            }).catch((e) => {
                reject(e);
            });
        }
    });
}

export default {legacy: module};