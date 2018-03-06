
'use strict';

module.exports = (_app) => {
	_app.app.get('/publications', (req, res) => {
		let content = _app.content;
		let publications     = content.entries.publication;
		let publicationsPage = content.pages.publicationsPage;
		let locals           = res.locals;
		locals.section       = 'publications';
		locals.siteName      = 'David Tomas Martinez';

		let renderArgs = {
			layout: 'page',
			heroTitle: publicationsPage.fields.heroTitle,
			heroSubtitle: publicationsPage.fields.heroSubtitle,
			heroImage: publicationsPage.fields.heroImage,
			publications: publications
		};

		res.render('publications', renderArgs);
	})
};
