'use strict';

const clone = require('lodash').clone;

module.exports = _app => {
	let app        = _app.app;
	let bodyParser = require('body-parser');
	// let emailValidator     = require("email-validator");

	app.use(bodyParser.json());

	app.use(function (req, res, next) {
		res.locals.instagramAccessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
		next();
	});

	exports.loadRoutes(_app);

	let InstagramLoader = _app.require('lib/InstagramLoader');
	InstagramLoader(app);
};

exports.loadRoutes = function loadRoutes(_app) {
	_app.require('app/routes/home')(_app);
	_app.require('app/routes/books')(_app);
	_app.require('app/routes/publications')(_app);
	_app.require('app/routes/press')(_app);
	_app.require('app/routes/contentful')(_app);
	_app.require('app/routes/contact')(_app);
};


exports.reloadRoutes = function loadRoutes(_app) {
	_app.routes = [];

	_app.requireReload('app/routes/home')(_app);
	_app.requireReload('app/routes/books')(_app);
	_app.requireReload('app/routes/publications')(_app);
	_app.requireReload('app/routes/press')(_app);
	_app.requireReload('app/routes/contentful')(_app);
};
