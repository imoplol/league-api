/**
 * url-builder.js
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

/*!
 *  Builds the URL with supplied JSON api endpoint
 *  TODO: add JSON schema validation method
 */

import UrlJoin      from 'url-join';
import _            from 'lodash';

function urlBuilder(endpoints, api, region, name, URLParams) {
    var urls = [ ];
    for(let i in api.api[region].actions[name].variations) {
        urls.push(UrlJoin(endpoints.endpoints[region].protocol,
            endpoints.endpoints[region].endpoint,
            api.api[region].actions[name].observer ?
                endpoints.endpoints[region].observer : UrlJoin(endpoints.endpoints[region].path, api.api[region].actions[name].version),
            api.api[region].actions[name].variations[i],
            (URLParams.length == 1) ? `?${URLParams[0]}` : _.union(`?${URLParams[0]}`, _.rest(URLParams))));
    }
    return urls;
}

export default urlBuilder;