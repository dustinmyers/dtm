'use strict';

require('dotenv').config();
global.rootPath = __dirname + '/';
const rootPath = global.rootPath;
const Application = require(`${rootPath}lib/Application`);
const app = new Application(rootPath, process.env.ENV);

module.exports = app;
