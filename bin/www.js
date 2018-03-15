'use strict';
//!/usr/bin / env node

const app = require('../main');
const http = require('http');
const passport   = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const server = app.start();

server.on('error', onError);
server.on('listening', onListening);

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
}, function (authAccessToken, authRefreshToken, profile, done) {
  console.log(authAccessToken, authRefreshToken, profile);
  process.env.ACCESS_TOKEN= authAccessToken;
  process.env.REFRESH_TOKEN = authRefreshToken;
  done(null, {
    access_token: accessToken,
    refresh_token: refreshToken,
    profile: profile
  });
}));

app.get('/add-imap/:address?', function (req, res, next) {
  passport.authorize('google-imap', {
    scope: [
      'https://mail.google.com/',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    callbackURL: config('web.vhost') + '/add-imap',
    accessType: 'offline',
    approvalPrompt: 'force',
    loginHint: req.params.address
  })(req, res, function () {
    res.send(req.user);
  });
});

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

function onListening() {
	let addr = server.address();
	let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	console.log('Listening on ' + bind);
}
