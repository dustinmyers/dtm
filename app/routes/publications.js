'use strict';

const moment = require('moment');

module.exports = (_app) => {
  function getPublicationsByDate(publications) {
    const publicationKeys = Object.keys(publications);
    const publicationsArray = [];
    publicationKeys.map(key => {
      console.log(publications[key].fields);
      publications[key].fields.publishDate
        ? publications[key].date = moment(publications[key].fields.publishDate).format('MMM D, YYYY')
        : null;
      publicationsArray.push(publications[key]);
    });

    return publicationsArray;
  }

	_app.app.get('/publications', (req, res) => {
		let content = _app.content;
		let publications     = getPublicationsByDate(content.entries.publication);
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
