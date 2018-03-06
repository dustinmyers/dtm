'use strict';

let hbs  = require('express-hbs');

module.exports = function(app) {
  app.set('views', 'app/views/');

  app.engine('hbs', hbs.express4({
    defaultLayout: 'app/views/layouts/main',
    partialsDir: 'app/views/partials',
    layoutsDir: 'app/views/layouts'
  }));
  app.set('view engine', 'hbs');

  app.use(require('express').static('./public'));
};
