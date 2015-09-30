/**
 * index.js
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

/*!
 *  League of Legends API Driver for imop.lol
 */
import  Winston         from 'winston';
import  _               from 'lodash';
import  TokenBucket     from 'tokenbucket';
import  EndPoints       from './config/endpoints.json';

class LeagueDriver {
    /*!
     *  Sample options
     *  {
     *      api_key: '00e033....',
     *      platform: 'production',
     *      region: 'NA'
     *
     *  }
     */
    constructor(options) {

        //  Sets class properties
        //  These are the two buckets used for rate limiting
        this.bucketS = new TokenBucket({
            size: EndPoints.endpoints[options.region].limit[options.platform].S.request,
            tokensToAddPerInterval: EndPoints.endpoints[options.region].limit[options.platform].S.request,
            interval: EndPoints.endpoints[options.region].limit[options.platform].S.interval,
            maxWait: 'minute'
        });
        this.bucketM = new TokenBucket({
            size: EndPoints.endpoints[options.region].limit[options.platform].M.request,
            tokensToAddPerInterval: EndPoints.endpoints[options.region].limit[options.platform].M.request,
            interval: EndPoints.endpoints[options.region].limit[options.platform].M.interval,
            maxWait: 'minute',
            parentBucket: this.bucketS
        });
        this.L = new (Winston.Logger)({
            transports: [
                new (Winston.transports.Console)({
                    colorize    : 'all'
                })
            ]
        });
        this.log = {
            verbose :   (tag, log) => {this.L.verbose(`[${tag}] : ${log}`);},
            info    :   (tag, log) => {this.L.info(`[${tag}] : ${log}`);},
            error   :   (tag, log) => {this.L.error(`[${tag}] : ${log}`);},
            warn    :   (tag, log) => {this.L.warn(`[${tag}] : ${log}`);}
        };
        this.api_key = options.api_key;
        //  Load all modules for the league driver
        this.loadModules();
        this.log.verbose(TAG, `started with options: ${JSON.stringify(options)}`);
    }

    loadModules() {
        //  Log tag
        let TAG = "LeagueDriver:loadModules";
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
        let TAG = "LeagueDriver:loadModule";
        this.log.info(TAG, `Loading module: ${file}`);
        _.assign(this, require(file));
    }
    module(name, options) {

        let TAG = 'LeagueDriver:module';
        //  This is the only access for modules, provide rate limiting
        if(typeof(this[name]) == 'function') {
            //  Invoke function
            this.bucketM.removeTokens(1).then(function(remainingTokens) {
                this.log.verbose(TAG, `removed 1 token, remaining ${remainingTokens}`);
                return this[name](options);     //  Finally call the function and return
            });
        } else {
            return new Promise(function (resolve) {
                resolve({
                    type: 'error',
                    error: 'module is not a function'
                });
            });
        }
    }

}

export default LeagueDriver;