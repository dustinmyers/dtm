
'use strict';


const defer = require('q').defer;
const reload = require('require-reload')(require);

class Application {
	constructor(rootPath, environment) {
		this.rootPath = rootPath;
		this.load();
	}

	require(path) {
		return require(this.path(path));
	}

	requireReload(path) {
		try {
			return reload(this.path(path));
		} catch (e) {
			console.error("Failed to reload api.js! Error: ", e);
		}
	}

	path(path) {
		return `${this.rootPath}${path}`;
	}

	loadConfig() {
		global.config = process.env;
	}

	loadContent() {
		let loaded = defer();
		let Content = require('./Content')(this);

		this.content = new Content();
		this.content.storeAll()
			.then(content => {
				loaded.resolve(content);
			})
			.catch(err => {
				loaded.reject(err);
				throw (err);
			});

		return loaded.promise;
	}

	loadExpress() {
		this.express = require('express');
		this.app = this.express();

		this.require('lib/express/views')(this.app);
		this.loadRoutes();
	}

	loadRoutes() {
		this.require('lib/express/routes')(this);
	}

	reloadRoutes() {
		this.require('lib/express/routes').reloadRoutes(this);
	}

	load() {
		this.loadContent();
		this.loadExpress();
	}

	start() {
		let port = this.normalizePort(process.env.SITE_PORT);
		this.app.listen(port, function() {
			console.log(`App listening on port ${port}`);
		});

		return this.app;
	}

	normalizePort(val) {
		let port = parseInt(val, 10);

		if (isNaN(port)) {
			return val;
		}

		return port >= 0 ? port : '3000'
	}
}

module.exports = Application;
