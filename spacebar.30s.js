#!/usr/bin/env /Users/scott/.nvm/versions/node/v7.10.1/bin/node
/* jshint esversion: 6 */

//# <bitbar.title>spacebar</bitbar.title>
//# <bitbar.version>v1.0</bitbar.version>
//# <bitbar.author>Scott Weaver</bitbar.author>
//# <bitbar.author.github>tdlm</bitbar.author.github>
//# <bitbar.desc>Displays upcoming Space Launches.</bitbar.desc>

const bitbar = require('bitbar');
const { httpGet } = require('./lib/helpers');
const moment = require('moment');

// Get upcoming launches
httpGet('https://launchlibrary.net/1.4/launch')
    .then(response => {
        let output = [];

        output.push({
            text: 'Space Launches',
            color: '#333',
            dropdown: false
        });

        output.push(bitbar.sep);

        response.launches.forEach(launch => {
            let submenu = [];

            submenu.push({
                text: 'Rocket: ' + launch.name,
                color: 'black'
            });

            submenu.push({
                text: 'Time to launch: ' + moment.utc(launch.windowstart).fromNow(),
                color: 'black'
            });

            if ('object' === typeof launch.vidURLs) {
                launch.vidURLs.forEach(video_url => {
                    submenu.push({
                        text: 'Video: ' + video_url,
                        href: video_url
                    });
                });
            }

            output.push({
                text: 'Launch #X',
                color: 'black',
                submenu: submenu
            });
        });

        output.push(bitbar.sep);

        bitbar(output);
    });
