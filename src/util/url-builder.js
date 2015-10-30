/**
 * url-builder.js
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

/*!
 *  Builds the URL with supplied JSON api endpoint
 *  TODO: add JSON schema validation method
 */

import _           from 'lodash';
import URL         from 'url';


function urlBuilder(endpoints, api, region, name, params, query) {
  const urls = [];
  const regex = new RegExp('{[a-z0-9_]+}', 'ig');

  const endpoint = endpoints.endpoints[region];
  const action = api.api[region].actions[name];

  for (const variation of action.variations) {

    const meta = Object.create(null);

    /* Protocol and hostname */
    meta.protocol = endpoint.protocol;
    meta.hostname = endpoint.endpoint;

    /* Pathname */
    try {
      const subst = _.template(variation)(params);
      meta.pathname = `${action.options.path}/${action.options.version}/${subst}`;
    } catch (err) {
      /* A requested param was not found, skip */
      break;
    }

    /* If parameters are an object... simply use builtin facilities */
    meta.query = query;

    /* Check the string, see if we are going to push anything */
    const url = URL.format(meta);
    if (url && !url.match(regex)) { urls.push(url); }
  }

  return urls;
}

export default urlBuilder;
