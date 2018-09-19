#!/usr/bin/env node
/* jshint esversion: 6 */

//# <bitbar.title>spacebar</bitbar.title>
//# <bitbar.version>v1.0</bitbar.version>
//# <bitbar.author>Scott Weaver</bitbar.author>
//# <bitbar.author.github>tdlm</bitbar.author.github>
//# <bitbar.desc>Displays upcoming SpaceX Launches.</bitbar.desc>

const config = require('./config');
const bitbar = require('bitbar');
const moment = require('moment');

const nodeFetch = require('node-fetch');
const cacheman = require('cacheman');
const cached = require('fetch-cached');

// TODO: Move back to helpers.js
const cache = new cacheman(config.cache);

// TODO: Move back to helpers.js
const fetch = cached.default({
    fetch: nodeFetch,
    cache: {
        get: k => cache.get(k),
        set: (k, v) => cache.set(k, v)
    }
});

/**
 * Fetch Launches and convert to JSON.
 *
 * TODO: Move this to helpers.js
 *
 * @return {Promise}
 */
function loadLaunches() {
    return fetch('https://launchlibrary.net/1.4/launch/next/25')
        .then(response => response.json());
}

let output = [];

// Get upcoming launches
loadLaunches()
    .then(response => {
        Promise.all(response.launches.map(launch =>
            fetch(`https://launchlibrary.net/1.4/launch/${launch.id}`).then(response => response.json()).then(response => response.launches.pop())
        )).then(results => {
            output.push({
                text: ':rocket:',
                dropdown: false
            });

            output.push(bitbar.sep);

            results.forEach(launch => {
                let submenu = [],
                    missions = [],
                    videos = [];

                submenu.push({
                    text: launch.lsp.name,
                    color: config.color.link,
                    href: launch.lsp.wikiURL
                });

                submenu.push({
                    text: 'Rocket: ' + launch.rocket.name,
                    color: config.color.text
                });

                submenu.push({
                    text: 'Launching from: ' + launch.location.name,
                    color: config.color.text
                });

                submenu.push({
                    text: 'Time to launch: ' + moment.utc(launch.isostart).fromNow(),
                    color: config.color.text
                });

                launch.missions.forEach(mission => {
                    missions.push({
                        text: mission.name + ': ' + mission.description,
                        color: config.color.text
                    });
                });

                launch.vidURLs.forEach(videoURL => {
                    videos.push({
                        text: videoURL,
                        color: config.color.link,
                        href: videoURL
                    });
                });

                if (missions.length) {
                    submenu.push({
                        text: 'Mission(s)',
                        color: config.color.text,
                        submenu: missions
                    });
                }

                if (videos.length) {
                    submenu.push({
                        text: 'Video(s)',
                        color: config.color.text,
                        submenu: videos
                    });
                }

                output.push({
                    text: launch.lsp.abbrev + ' / ' + launch.rocket.name,
                    color: config.color.text,
                    submenu: submenu
                });
            });
        }).then(results => {
            output.push(bitbar.sep);
            bitbar(output);
        })
            .catch(error => {
                console.log('error: ' + error);
            });

    })
    .catch(error => {
        console.log('error: ' + error);
    });
