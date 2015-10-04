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

function urlBuilder(endpoints, api, region, name, params, URLParams) {
    var urls = [ ];
    var url = '';
    var regex = new RegExp("{[a-z0-9_]+}", "ig");
    for(let i in api.api[region].actions[name].variations) {
        //url = UrlJoin(endpoints.endpoints[region].protocol,
        //    endpoints.endpoints[region].endpoint,
        //    api.api[region].actions[name].observer ?
        //        endpoints.endpoints[region].observer : UrlJoin(endpoints.endpoints[region].path, api.api[region].actions[name].version),
        //    api.api[region].actions[name].variations[i],
        //    (URLParams.length == 1) ? `?${URLParams[0]}` : _.union(`?${URLParams[0]}`, _.rest(URLParams)));

        //  Construct the basic endpoint url
        url = UrlJoin(endpoints.endpoints[region].protocol,
            endpoints.endpoints[region].endpoint);

        //  Append any options to the end of the url
        for(let option of Object.keys(api.api[region].actions[name].options)) {
            url = UrlJoin(url, api.api[region].actions[name].options[option])
        }

        //  Append the actual action, variation
        url = UrlJoin(url, api.api[region].actions[name].variations[i]);


        //  Append any url params
        for(let i in URLParams) {
            if(i == 0) {
                url = UrlJoin(url, "?" + URLParams[i]);
            } else {
                url = UrlJoin(url, URLParams[i]);
            }
        }

        if(params) {
            for(let property of Object.keys(params)) {
                //  Replace placeholder
                var temp = url.replace(`{${property}}`, params[property]);
                if(temp == url) {
                    //  Nothing is replaced, exit and exit
                    url = '';
                    break;
                }
                url = temp;
            }
        }
        //  Check the string, see if we are going to push anything
        if(url) {
            if(!url.match(regex)) {
                urls.push(url);
            }
        }
    }
    return urls;
}

export default urlBuilder;