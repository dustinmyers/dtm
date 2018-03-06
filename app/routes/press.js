//
'use strict';

const each = require('lodash').each;

module.exports = (_app) => {
	_app.app.get('/press', (req, res) => {
		let content = _app.content;
		let pressItems  = content.entries.pressItem;
		let galleries   = content.entries.gallery;
		let pressPage = content.pages.pressMediaPage;
		let locals      = res.locals;
		locals.section  = 'publications';
		locals.siteName = 'David Tomas Martinez';

		each(pressItems, pressItem => {
			switch(this.type) {
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
