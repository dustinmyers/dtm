
'use strict';

let bookReviews   = require('../content/bookReviews.json');
let galleryImages = require('../content/galleryImages.json').images;
let publications  = require('../content/publications.json').publications;
let pressItems    = require('../content/pressItems.json').pressItems;

let spaceImport = require('contentful-import');
let options     = {
	content: {
		entries: []
	},
	spaceId: process.env.CONTENTFUL_SPACE_ID,
	managementToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
};

spaceImport(options)
	.then(output => {
		console.log(output);
		console.log('Data Imported successfully');
	})
	.catch((err) => {
		console.log('oh no! errors occurred!', err)
	});


class Importer {
	constructor() {

	}
}

let contentful = require('contentful-management');

const client = contentful.createClient({
	accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const contentTypeId = '5aL1iEoPWE44KAcwUOw8M6';

async function main() {
	let content = publications;
	const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
	let payload = content.map(entry => rowToEntry(space, row));

	console.log('entries', payload);
}

/**
 * Finds an entry and updates it, or creates a new entry if no existing entry is found.
 *
 * The update logic simply overwrites the existing fields, a deep merge would
 * be a better strategy if the entries also have fields that are edited by humans.
 */
async function rowToEntry(space, row) {
	const sys    = {id};
	const fields = rowToFields(row);
	space.createEntry(contentTypeId,
		{
			sys,
			fields
		});
}

/**
 * This helper maps a CSV row to the contentful fields structure.
 * Currently it's hard-coded to use en-US, but expanding this script to support
 * multiple locales (maybe by importing different files) would be trivial.
 */
function rowToFields(row) {
	return {
		firstName: {'en-US': row['first name']},
		lastName: {'en-US': row['last name']},
		age: {'en-US': parseInt(row['age'], 10)}
	};
}

main().catch((err) => {
	console.error(err.stack);
	process.exit(1);
});
