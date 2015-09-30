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

class LeagueDriver {
    constructor(options) {
        //  Sets class properties
        this.bucket = new TokenBucket();
        this.L = new (Winston.Logger)({
            transports: [
                new (Winston.transports.Console)({
                    colorize    : 'all'
                })
            ]
        });
        this.Log = {
            verbose :   (tag, log) => {this.L.verbose(`[${tag}] : ${log}`);},
            info    :   (tag, log) => {this.L.info(`[${tag}] : ${log}`);},
            error   :   (tag, log) => {this.L.error(`[${tag}] : ${log}`);},
            warn    :   (tag, log) => {this.L.warn(`[${tag}] : ${log}`);}
        };
        this.api_key = options.api_key;
        //  Load all modules for the league driver
        this.loadModules();
    }

    loadModules() {
        //  Log tag
        let TAG = "LeagueDriver:loadModules";
        //  Filename regex
        var regex = /^([a-z0-9_]+).js$/;

        //  Loading all transformer modules
        var filenames = require("fs").readdirSync(require("path").join(__dirname, 'modules'));

        //  Loop through the files and load them into the chainable class.
        for(var file of filenames) {
            if(regex.test(file)) {
                this.Log.info(TAG, `Loading module: ${file}`);
                _.assign(this, require(`./modules/${regex.exec(file)[1]}`));
            }
        }
    }
    loadModule(file) {
        //  Log tag
        let TAG = "LeagueDriver:loadModule";
        this.Log.info(TAG, `Loading module: ${file}`);
        _.assign(this, require(file));
    }
}

export default LeagueDriver;