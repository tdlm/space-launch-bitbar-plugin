const nodeFetch = require('node-fetch');
const cacheman = require('cacheman');
const cached = require('fetch-cached');

const cache = new cacheman({
    ttl: 5,
    engine: 'file'
});

const fetch = cached.default({
    fetch: nodeFetch,
    cache: {
        get: k => cache.get(k),
        set: (k, v) => cache.set(k, v)
    }
});

/**
 * Fetch URL and return fetch Promise.
 *
 * @param {String} url URL to fetch.
 *
 * @return {Promise}
 */
const httpGet = url => {
    let options = {
        method: 'GET',
        mode: 'cors'
    };

    return fetch(url, options).then(response => response.json());
};

module.exports = {
    httpGet
};
