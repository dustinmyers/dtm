
'use strict';

module.exports = _app => {
	let Mailer = require('./Mailer')(_app);

	class ContactMailer extends Mailer {
		static get templateName() {
			return 'contact_form'
		}

		constructor(submission) {
			super(submission);

			this.mailOptions = {
				from: {
					name: submission.contact_name,
					address: submission.contact_email
				},
				to: process.env.CONTACT_MAILTO,
				subject: 'Contact Submission From Website',
				html: this.html(submission),
				text: submission.body
			};
		}

		send(callback) {
			console.log(this.mailOptions)
			this.sendMessage(this.mailOptions, callback)
		}
	}

	return ContactMailer;
};
