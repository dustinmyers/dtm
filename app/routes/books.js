'use strict';

const values = require('lodash').values;
const map    = require('lodash').map;

module.exports = (_app) => {
	_app.app.get('/books', (req, res) => {
		let content = _app.content;
		let books       = map(content.entries.book, book => {
			book.fields.reviews = values(book.fields.reviews);
			return book;
		});

		let booksPage   = content.pages.booksPage;
		let locals      = res.locals;

		locals.section  = 'books';
		locals.siteName = 'David Tomas Martinez';

		res.render('books', {
			layout: 'page',
			heroTitle: booksPage.fields.heroTitle,
			heroSubtitle: booksPage.fields.heroSubtitle,
			heroImage: booksPage.fields.heroImage,
			books: books
		});
	});
};
