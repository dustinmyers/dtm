'use strict';

const _ = require('lodash');

module.exports = (_app) => {
	_app.app.get('/', (req, res) => {
		let content = _app.content;
		let page   = content.pages.homePage;
		let locals      = res.locals;
		locals.section  = 'home';
		locals.siteName = 'David Tomas Martinez';

		let renderArgs = {
			layout: 'main',
			heroTitle: page.fields.heroTitle,
			heroSubtitle: page.fields.heroSubtitle,
			heroImage: page.fields.heroImage,
			bioEmphasizedText: page.fields.bioEmphasizedText,
			bioImage: page.fields.bioImage,
			bioContent: page.fields.bio,
			excerptHeader: page.fields.excerptHeader,
			excerptContent: page.fields.excerptContent
		};

		res.render('index', renderArgs);
	});
};
