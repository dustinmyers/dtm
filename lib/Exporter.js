
'use strict';

const spaceExport = require('contentful-export');

const options = {
	spaceId: 'w88v3lyxyrc0',
	token: 'eb5cc1ddc2bd2ad5fc54f01bb606bf87373e3c92b5fb68cdbd4dd32435451c05'
};

spaceExport(options)
	.then((output) => {
		console.log('space data', output)
	})
	.catch((err) => {
		console.log('oh no! errors occurred!', err)
	});
