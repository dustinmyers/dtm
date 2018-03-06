'use strict';

const nodemailer = require('nodemailer');
const fs         = require('fs');
const Handlebars = require('handlebars');

module.exports = _app => {
	class Mailer {
		static get smtpConfig() {
			return {
				host: 'smtp.gmail.com',
				port: 465,
				secure: true, // use SSL
				auth: {
					user: process.env.GMAIL_USER,
					pass: process.env.GMAIL_PASSWORD
				}
			}
		}

		static get templatesDir() { return _app.path('app/mailers/') }

		static get templateName() { throw "Template name must be set for mailers." }

		constructor() {
			console.log(Mailer.smtpConfig);
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
