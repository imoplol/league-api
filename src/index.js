/**
 * index.js
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

/*!
 *  API Driver for imop.lol
 */
import  Winston         from 'winston';
import  _               from 'lodash';
import  TokenBucket     from 'tokenbucket';

class APIDriver {
    /*!
     *  Sample options
     *  {
     *      api_key: '00e033....',
     *      platform: 'production',
     *      region: 'NA'
     *
     *  }
     */
    constructor(endpoints, api, options) {

        let TAG = "APIDriver:constructor";

        //  Sets class properties
        this.endpoints      = endpoints;
        this.api            = api;
        this.options        = options;
        this.api_key        = options.api_key;
        this.defaultParams  = [`api_key=${this.api_key}`];
        //  These are the two buckets used for rate limiting
        this.bucketS = new TokenBucket({
            size: this.endpoints.endpoints[options.region].limit[options.platform].S.request,
            tokensToAddPerInterval: this.endpoints.endpoints[options.region].limit[options.platform].S.request,
            interval: this.endpoints.endpoints[options.region].limit[options.platform].S.interval,
            maxWait: 'minute'
        });
        this.bucketM = new TokenBucket({
            size: this.endpoints.endpoints[options.region].limit[options.platform].M.request,
            tokensToAddPerInterval: this.endpoints.endpoints[options.region].limit[options.platform].M.request,
            interval: this.endpoints.endpoints[options.region].limit[options.platform].M.interval,
            maxWait: 'minute',
            parentBucket: this.bucketS
        });
        this.L = new (Winston.Logger)({
            transports: [
                new (Winston.transports.Console)({
                    colorize    : 'all',
                    level       : 'verbose'
                })
            ]
        });
        this.log = {
            verbose :   (tag, log) => {this.L.verbose(`[${tag}] : ${log}`);},
            info    :   (tag, log) => {this.L.info(`[${tag}] : ${log}`);},
            error   :   (tag, log) => {this.L.error(`[${tag}] : ${log}`);},
            warn    :   (tag, log) => {this.L.warn(`[${tag}] : ${log}`);}
        };
        //  Load all modules for the league driver
        this.loadModules();
        this.log.verbose(TAG, `started with options: ${JSON.stringify(options)}`);
    }

    loadModules() {
        //  Log tag
        let TAG = "APIDriver:loadModules";
        //  Filename regex
        var regex = /^([a-z0-9_]+).js$/;

        //  Loading all modules
        var filenames = require("fs").readdirSync(require("path").join(__dirname, 'modules'));

        //  Loop through the files and load them into the class.
        for(var file of filenames) {
            if(regex.test(file)) {
                this.log.info(TAG, `Loading module: ${file}`);
                _.assign(this, require(`./modules/${regex.exec(file)[1]}`));
            }
        }
    }
    loadModule(file) {
        //  Log tag
        let TAG = "APIDriver:loadModule";
        this.log.info(TAG, `Loading module: ${file}`);
        _.assign(this, require(file));
    }
    module(name, options) {

        let TAG = 'APIDriver:module';

        //console.log(this);

        //  This is the only access for modules, provide rate limiting
        if(typeof(this[name]) == 'function') {
            //  Invoke function
            this.log.verbose(TAG, `invoking module: ${name}`);
            var urlParams = [];
            if(options.urlParams) {
                for(let property of Object.keys(options.urlParams)) {
                    urlParams.push(`${property}=${options.urlParams[property]}`);
                }
            }
            return new Promise((resolve, reject) => {
                this[name](options, _.union(urlParams, this.defaultParams)).then((result) => {
                    resolve(result);
                }).catch((e) => {
                    reject(e);
                });     //  Finally call the function and return
            });
        } else {
            this.log.verbose(TAG, `invoking module: ${name} error`);
            return new Promise(function (resolve) {
                resolve({
                    type: 'error',
                    error: 'module is not a function'
                });
            });
        }
    }

}

export default APIDriver;