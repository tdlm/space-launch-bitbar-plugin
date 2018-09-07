#!/usr/bin/env /Users/scott/.nvm/versions/node/v7.10.1/bin/node
/* jshint esversion: 6 */

//# <bitbar.title>spacebar</bitbar.title>
//# <bitbar.version>v1.0</bitbar.version>
//# <bitbar.author>Scott Weaver</bitbar.author>
//# <bitbar.author.github>tdlm</bitbar.author.github>
//# <bitbar.desc>Displays upcoming SpaceX Launches.</bitbar.desc>

const bitbar = require('bitbar');
const moment = require('moment');

const nodeFetch = require('node-fetch');
const cacheman = require('cacheman');
const cached = require('fetch-cached');

// TODO: Move back to helpers.js
const cache = new cacheman({
    ttl: 10 * 60, // 10 minutes.
    engine: 'file'
});

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
    return fetch('https://launchlibrary.net/1.4/launch')
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
                text: 'Space Launches',
                color: '#333',
                dropdown: false
            });

            output.push(bitbar.sep);

            results.forEach(launch => {
                let submenu = [],
                    missions = [],
                    videos = [];

                submenu.push({
                    text: 'Rocket: ' + launch.rocket.name,
                    color: 'black'
                });

                submenu.push({
                    text: 'Provider: ' + launch.lsp.name,
                    color: 'black'
                });

                submenu.push({
                    text: 'Launching from: ' + launch.location.name,
                    color: 'black'
                });

                submenu.push({
                    text: 'Time to launch: ' + moment.utc(launch.isostart).fromNow(),
                    color: 'black'
                });

                launch.missions.forEach(mission => {
                    missions.push({
                        text: mission.name + ': ' + mission.description,
                        color: 'black'
                    });
                });

                launch.vidURLs.forEach(videoURL => {
                    videos.push({
                        text: videoURL,
                        color: 'red',
                        href: videoURL
                    });
                });

                if (missions.length) {
                    submenu.push({
                        text: 'Mission(s)',
                        color: 'black',
                        submenu: missions
                    });
                }

                if (videos.length) {
                    submenu.push({
                        text: 'Video(s)',
                        color: 'black',
                        submenu: videos
                    });
                }

                output.push({
                    text: launch.lsp.abbrev + ' / #' + launch.id,
                    color: 'black',
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
