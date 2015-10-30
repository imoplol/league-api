/**
 * legacy.js
 * calls Riot's legacy API
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';
import Debug       from 'debug';
import Request     from 'request-promise';

async function legacy(options, query) {

  const debug = Debug('legacy');

  const meta = this.api.api[this.options.region];

  let urls;
  if (_.includes(meta.supported, options.action)) {
    urls = this.buildUrl(this.options.region, options.action, options.params, query);
  } else {
    throw new Error('Action not supported in legacy');
  }

  const request = {
    url: urls[0],
    transform: function(body, response) {
      if (response.headers['content-type'].indexOf('application/json') > -1) {
        return JSON.parse(body);
      }
      return body;
    }
  };

  if (meta.actions[options.action].limitrate) {
    const remaining = await this.bucketM.removeTokens(1);
    debug(`removed 1 token, remaining ${remaining}`);
  }

  return Request(request);
}

export default function(client) {

  client.legacy = legacy;

}
