
'use strict';

var ig = require('instagram-node').instagram();

let igOptions = {
  client_id: process.env.INSTAGRAM_CLIENT_ID,
  client_secret: process.env.INSTAGRAM_CLIENT_SECRET
};

ig.use(igOptions);

class InstagramLoader {
  static mostPopular(callback) {
    ig.media_popular(function(err, medias, remaining, limit) {
      if(err) {
        console.error(`Could not fetch Instagram Popular Media: ${err.error_message}`);
        callback([]);
      }

      callback(medias);
    });
  }
}

var redirect_uri = `${process.env.BASE_URL}handleauth`;

var authorize_user = function(req, res) {
  res.redirect(ig.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
};

var handleauth = function(req, res) {
  ig.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.err(err.body);
      res.send("Didn't work");
    } else {
    	console.log(result);
      ig.use({access_token: result.access_token});
      res.send('You made it!!');
    }
  });
};

module.exports = function(app) {
  app.get('/authorize_user', authorize_user);
  app.get('/handleauth', handleauth);

  return InstagramLoader
}
