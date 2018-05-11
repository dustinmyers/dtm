'use strict';

const each = require('lodash').each;
const moment = require('moment');

const titleize = require('../utils/titleize');

module.exports = (_app) => {
  function configureItems(items) {
    const itemsKeys = Object.keys(items);
    const itemsArray = [];
    itemsKeys.map(key => {
      items[key].fields.date
        ? items[key].date = moment(items[key].fields.date).format('MMM D, YYYY')
        : null;
      itemsArray.push(items[key]);
    });
    each(items, pressItem => {
      pressItem.fields.type = titleize(pressItem.fields.type);
      switch(pressItem.fields.type) {
        case 'appearance':
          pressItem.typeIcon = 'icon-camera';
          break;
        case 'interview':
          pressItem.typeIcon = 'icon-mic';
          break;
        case 'review':
          pressItem.typeIcon = 'icon-newspaper';
          break;
        default:
          pressItem.typeIcon = 'icon-document';
          break;
      }
    });

    return items;
  }

	_app.app.get('/press', (req, res) => {
		let content = _app.content;
		let pressItems  = configureItems(content.entries.pressItem);
		let galleries   = content.entries.gallery;
		let pressPage = content.pages.pressMediaPage;
		let locals      = res.locals;
		locals.section  = 'publications';
		locals.siteName = 'David Tomas Martinez';

		let renderArgs = {
			layout: 'page',
			heroTitle: pressPage.fields.heroTitle,
			heroSubtitle: pressPage.fields.heroSubtitle,
			heroImage: pressPage.fields.heroImage,
			pressItems: pressItems,
			galleries: galleries
		};

		res.render('press', renderArgs);
	})
};
