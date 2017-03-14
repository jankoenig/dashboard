/**
 * Used for setting up a mock DOM enviroment within Node.js
 *
 * From https://github.com/airbnb/enzyme/blob/master/docs/guides/jsdom.md#using-enzyme-with-jsdom
 */

var jsdom = require('jsdom').jsdom;

global.document = jsdom('');
global.window = document.defaultView;
global.Audio = global.window.Audio; // Set the Audio constructor
Object.keys(document.defaultView).forEach(function (property) {
    if (typeof global[property] === 'undefined') {
        global[property] = document.defaultView[property];
    }
});

global.navigator = {
    userAgent: 'node.js'
};