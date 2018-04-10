
'use strict';

const defer     = require('q').defer;
const qAll      = require('q').all;
const each      = require('lodash').each;
const values    = require('lodash').values;
const map       = require('lodash').map;
const mapValues = require('lodash').mapValues;
const isArray   = require('lodash').isArray;
const isEmpty   = require('lodash').isEmpty;
const isNil     = require('lodash').isNil;
const clone     = require('lodash').clone;
const fs        = require('fs');
const request   = require('request');
const extname   = require('path').extname;

module.exports = app => {
	class Content {
		static get assetsPath() {
			return app.path('public/images/cdn');
		}

		static assetPath(assetId, ext) {
			return `${this.assetsPath}/${assetId}${ext}`
		}

		static get pages() {
			return [
				'booksPage',
				'homePage',
				'pressMediaPage',
				'publicationsPage'
			]
		}

		static get types() {
			return [
				'book',
				'bookReview',
				'gallery',
				'pressItem',
				'publication',
				'booksPage',
				'homePage',
				'pressMediaPage',
				'publicationsPage'
			]
		}

		constructor() {
			this.pages   = {};
			this.entries = {};
			this.assets  = {};

			each(Content.types, type => {
				this.entries[type] = {};
			});

			this.connect()
		}

		connect() {
			this.contentful    = require('contentful');
			this.contentClient = this.contentful.createClient({
				space: '0tt8w3vv4d73',
				accessToken: '2dbbf77eaed87f27f66d3f0566ffcb48ae719497fadf7ffe113e3c17179c6d1a',
			});
		}

		storeAll() {
			let fetched = defer();

			this.fetchAll()
					.then(entries => {

						this.fetchAssets()
								.then(assets => {
									this.downloadAssets(assets)
											.then(() => {
												let entryId;
												let contentTypeId;

												each(entries.items, item => {
													contentTypeId = item.sys.contentType.sys.id;
													entryId       = item.sys.id;

													this.addEntry(contentTypeId, entryId, item);
												});

												each(Content.pages, pageKey => {
													this.addPage(pageKey);
												});

												fetched.resolve(entries);
											})
											.catch((err) => {
												fetched.reject(err);
												throw(err);
											})
								})
								.catch((err) => {
									fetched.reject(err);
									throw(err);
								})
					})
					.catch(err => {
						fetched.reject(err);
						throw(err);
					});

			return fetched.promise;
		}

		addEntry(typeId, id, entry) {
			let assetId;
			let ext;

			let fields = mapValues(entry.fields, (field) => {
				if(field.sys && field.sys.type == 'Asset') {
					assetId = field.sys.id;
					ext     = extname(field.fields.file.fileName);

					return `${assetId}${ext}`;
				}

				return field
			});

			entry.fields = fields;

			return this.entries[typeId][id] = entry;
		}

		addPage(page) {
			let assetId;
			let ext;
			let _page = clone(this.entries[page]);

			if(isNil(_page) || isEmpty(_page)) {
				return;
			}

			if(isArray(_page)) {
				console.log('Converting Array');
				_page = _page[0];
			}

			let fields = map(_page, (props, pageId) => {
				return mapValues(props.fields, field => {
					if(field.sys && field.sys.type == 'Asset') {
						assetId = field.sys.id;
						ext     = extname(field.fields.file.fileName);

						return `${assetId}${ext}`;
					}

					return field;
				});
			});

			_page.fields = fields[0];

			if(_page.fields && _page.fields.isPage) {
				return this.pages[page] = _page;
			}
		}

		fetchAll() {
			let orderBy = "sys.contentType.sys.id,sys.id";
			return this.contentClient.getEntries({
				order: orderBy,
				include: 5
			});
		}

		// fetchType(typeName) {
		// 	return this.contentClient.getContentType(typeName)
		// }

		fetchAssets() {
			return this.contentClient.getAssets()
		}

		hasImage(assetId) {
			return fs.existsSync(Content.assetPath(assetId));
		}

		downloadAssets(assets) {
			let assetId;
			let assetUrl;
			let extension;
			let downloaded = defer();

			return qAll(map(assets.items, asset => {
				downloaded           = defer();
				assetId              = asset.sys.id;
				extension            = extname(asset.fields.file.fileName);
				assetUrl             = `http:${asset.fields.file.url}`;
				this.assets[assetId] = asset;


				return this.downloadAsset(assetId, assetUrl, extension);
			}));
		}

		downloadAsset(assetId, assetUrl, ext) {
			let downloaded = defer();

			if(!this.hasImage(assetId, ext)) {
				this.download(assetUrl, Content.assetPath(assetId, ext), () => {
					downloaded.resolve();
				});
			} else {
				downloaded.resolve();
			}

			return downloaded.promise;
		}

		download(uri, filename, callback) {
			request.head(uri, (err, res, body) => {
				if(err) {
					throw err;
				}

				request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
			});
		}
	}

	return Content;
};
