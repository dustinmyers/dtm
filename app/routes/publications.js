'use strict';

const moment = require('moment');
const each = require('lodash').each;

const titleize = require('../utils/titleize');

module.exports = (_app) => {
  function getPublicationsByDate(publications) {
    const publicationKeys = Object.keys(publications);
    const publicationsArray = [];
    publicationKeys.map(key => {
      publications[key].fields.publishDate
        ? publications[key].date = moment(publications[key].fields.publishDate).format('MMM D, YYYY')
        : null;
      publicationsArray.push(publications[key]);
    });

    const configuredPublications = each(publicationsArray, publication => {
      publication.fields.type = titleize(publication.fields.type);
      switch(publication.fields.type) {
        case 'Journal':
        case 'Magazine':
          publication.typeIcon = 'icon-book-open';
          break;
        case 'Newspaper':
          publication.typeIcon = 'icon-newspaper';
          break;
        default:
          publication.typeIcon = 'icon-document';
          break;
      }
    });

    return configuredPublications;
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
