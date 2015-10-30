/**
 * index.js
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';
import FS          from 'fs';
import Path        from 'path';
import Debug       from 'debug';
import TokenBucket from 'tokenbucket';

import buildUrl    from './util/url-builder';


/*!
 * Symbol to hide extension tracking.
 */
const exts = Symbol();


/*!
 *  API Driver for imop.lol
 */
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

    const debug = Debug('APIDriver:constructor');

    /* Sets class properties */
    this.api           = api;
    this.options       = options;
    this.endpoints     = endpoints;
    this.api_key       = options.api_key;
    this.defaultParams = { api_key: this.api_key };

    /* These are the two buckets used for rate limiting */
    const bucketConfig = this.endpoints.endpoints[options.region].limit[options.platform];
    this.bucketS = new TokenBucket({
      maxWait: 'minute',
      size: bucketConfig.S.request,
      interval: bucketConfig.S.interval,
      tokensToAddPerInterval: bucketConfig.S.request
    });
    this.bucketM = new TokenBucket({
      maxWait: 'minute',
      size: bucketConfig.M.request,
      parentBucket: this.bucketS,
      interval: bucketConfig.M.interval,
      tokensToAddPerInterval: bucketConfig.M.request
    });

    /* URL Builder */
    this.buildUrl = _.partial(buildUrl, endpoints, api);

    /* Load all modules for the league driver */
    this[exts] = new Set();
    this.loadModules();
    debug(`Started with options: ${JSON.stringify(options)}`);
  }

  use(fn) {
    if (fn.__esModule) { fn = fn.default; }

    if (!this[exts].has(fn)) { fn(this); }
  }

  loadModules() {

    /* Log tag */
    const debug = Debug('APIDriver:loadModules');

    /* Filename regex */
    const regex = /^([a-z0-9_]+).js$/;

    /* Loading all modules */
    const filenames = FS.readdirSync(Path.join(__dirname, 'modules'));

    /* Loop through the files and load them into the class. */
    for (const file of filenames) {
      if (!regex.test(file)) { continue; }

      debug(`Loading module: ${file}`);
      this.use(require(`./modules/${regex.exec(file)[1]}`));
    }

  }

  loadModule(file) {
    /* Log tag */
    const debug = Debug('APIDriver:loadModule');
    debug(`Loading module: ${file}`);
    this.use(require(file));
  }

  async module(name, options) {

    const debug = Debug('APIDriver:module');
    const fn  = this[name];

    /* Module in question must be a function */
    if (typeof fn !== 'function') {
      throw new Error('Module is not a function.');
    }

    /* Invoke the module function */
    debug(`invoking module: ${name}`);
    const params = _.defaults({ }, options.urlParams, this.defaultParams);
    return this[name](options, params);
  }

}

export default APIDriver;
