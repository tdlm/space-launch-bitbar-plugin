#!/usr/bin/env /Users/scott/.nvm/versions/node/v7.10.1/bin/node
/* jshint esversion: 6 */

//# <bitbar.title>spacebar</bitbar.title>
//# <bitbar.version>v1.0</bitbar.version>
//# <bitbar.author>Scott Weaver</bitbar.author>
//# <bitbar.author.github>tdlm</bitbar.author.github>
//# <bitbar.desc>Displays upcoming SpaceX Launches.</bitbar.desc>

const bitbar = require('bitbar');
const { httpGet } = require('./lib/helpers');
const moment = require('moment');

// Get upcoming launches
httpGet('https://api.spacexdata.com/v2/launches/upcoming')
    .then(response => {
        let output = [];

        output.push({
            text: 'SpaceX Launches',
            color: '#333',
            dropdown: false
        });

        output.push(bitbar.sep);

        response.forEach(launch => {
            let submenu = [];

            submenu.push({
                text: 'Rocket: ' + launch.rocket.rocket_name,
                color: 'black'
            });

            submenu.push({
                text: 'Launching from: ' + launch.launch_site.site_name_long,
                color: 'black'
            });

            submenu.push({
                text:
                    'Time to launch: ' +
                    moment.utc(launch.launch_date_utc).fromNow(),
                color: 'black'
            });

            if (null !== launch.details) {
                submenu.push({
                    text: 'Detail: ' + launch.details,
                    color: 'black'
                });
            }

            if (null !== launch.links.video_link) {
                submenu.push({
                    text: 'Video',
                    href: launch.links.video_link
                });
            }

            output.push({
                text: 'Launch #' + launch.flight_number,
                color: 'black',
                submenu: submenu
            });
        });

        output.push(bitbar.sep);

        bitbar(output);
    });
