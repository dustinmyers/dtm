'use strict';

const nodemailer = require('nodemailer');
const fs         = require('fs');
const Handlebars = require('handlebars');
const passport   = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

let accessToken;
let refreshToken;

module.exports = _app => {
	class Mailer {

	  static get runTokens() {
	    console.log('herheherhe');
      passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
      }, function (authAccessToken, authRefreshToken, profile, done) {
        console.log(authAccessToken, authRefreshToken, profile);
        accessToken = authAccessToken;
        refreshToken = authRefreshToken;
        done(null, {
          access_token: accessToken,
          refresh_token: refreshToken,
          profile: profile
        });
      }));

      exports.mount = function (app) {
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
      };
    }

		static get smtpConfig() {
		  Mailer.runTokens;
			return {
				service: 'Gmail',
				auth: {
					XOAuth2: {
            user: process.env.GMAIL_USER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
						refresh_token: process.env.refreshToken,
						access_token: process.env.accessToken,
          }
        }
			}
		}

		static get templatesDir() { return _app.path('app/mailers/') }

		static get templateName() { throw "Template name must be set for mailers." }

		constructor() {
			console.log('**********', Mailer.smtpConfig);
			this.transporter = nodemailer.createTransport(Mailer.smtpConfig);
		}

		sendMessage(data, callback) {
			this.transporter.sendMail(data, function(error, info){
				if(error){
					callback({error: error});
					return;
				}
				callback(info.response);
			});
		}

		get template() {
			let templatePath = this.constructor.templatesDir + this.constructor.templateName + '.handlebars';
			let source = fs.readFileSync(templatePath, 'utf8');
			return Handlebars.compile(source);
		}

		html(data) {
			return this.template(data);
		}
	}

	return Mailer;
};
