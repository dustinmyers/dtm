'use strict';

const nodemailer = require('nodemailer');
const fs         = require('fs');
const Handlebars = require('handlebars');

module.exports = _app => {
	class Mailer {

		static get templatesDir() { return _app.path('app/mailers/') }

		static get templateName() { throw "Template name must be set for mailers." }

		constructor() {
		  this.smtpConfig = this.smtpConfig.bind(this);
		  this.sendMessage = this.sendMessage.bind(this);
		}

		smtpConfig() {
      return {
        services: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.GMAIL_USER,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refresh_token: process.env.GMAIL_REFRESH_TOKEN,
          access_token: process.env.GMAIL_ACCESS_TOKEN,
        },
      };
		}

		sendMessage(data, callback) {
      const transporter = nodemailer.createTransport(this.smtpConfig());
      transporter.verify(function(error, success) {
        if (error) {
          console.log('error in verify: ', error);
        } else {
          console.log('Server is ready to take our messages');
        }
      });
      transporter.on('token', token => {
        console.log('A new access token was generated');
        console.log('User: %s', token.user);
        console.log('Access Token: %s', token.accessToken);
        console.log('Expires: %s', new Date(token.expires));
      });
      transporter.sendMail(data, function(error, info){
        if(error){
          console.log('error....', error);
          callback({error: error});
          return;
        }
        console.log(info.response);
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
