'use strict';

const emailValidator = require('email-validator');

module.exports = (_app) => {
	let ContactMailer = _app.require('lib/ContactMailer')(_app);

	_app.app.post('/contact_form', (req, res) => {
		let name  = req.body.contact_name;
		let email = req.body.contact_email;
		let body  = req.body.contact_body;

		let mailer = new ContactMailer({
			contact_name: name,
			contact_email: email,
			body: body
		});

		if(!emailValidator.validate(email)) {
			res.status(422);
			res.json(JSON.stringify({message: "Invalid Email"}));
			return;
		}

		if(!body || /^\s*$/.test(body)) {
			res.status(422);
			res.json(JSON.stringify({message: "You must provide a message."}));
			return;
		}

		mailer.send(function (mailerResp) {
			if(mailerResp.error) {
				res.json(mailerResp.error);
				return;
			}

			res.json(mailerResp);
		});
	});
};
