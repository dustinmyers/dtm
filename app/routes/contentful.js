'use strict';

module.exports = (_app) => {
	_app.app.post('/contentful/update', (req, res) => {
		console.log('Contentful Update. Reloading content...');

		_app.loadContent()
				.then(() => {
					console.log('Content loaded');
					res.status(200).send('Content Loaded!');
				})
				.catch(err => {
					res.status(500).send(err.message);
				});
	})
};
