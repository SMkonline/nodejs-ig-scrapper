const express = require('express');
const Instagram = require('instagram-web-api');
const FileCookieStore = require('tough-cookie-filestore2');

const { connectDB } = require('./database');

const cookieStore = new FileCookieStore('./cookies.json')

const profile = require('./controllers/profile.controller');
const hashtag = require('./controllers/hashtag.controller');

require('dotenv').config({ path: '/var/www/ig-scrapper/.env' });

connectDB(process.env.DB_HOST, {user: process.env.DB_USER, pass: process.env.DB_PASS, useFindAndModify: false, useUnifiedTopology: true });

const { username_instagram, password_instagram } = process.env;

const client = new Instagram({ username: username_instagram, password: password_instagram, cookieStore });

console.log(cookieStore.idx);
let haveCookie = cookieStore.idx['instagram.com']['/'].csrftoken;

const hours = 43200;

var app = express();
app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res) {

  const $_hashtag = req.query.hashtag ? req.query.hashtag : null;
  const $_profile = req.query.profile ? req.query.profile : null;
  let response;

  (async function() {
   
    if (!haveCookie) {
      await client.login();
    }

    if($_profile) {
      profile.getProfile($_profile, req, res, client, hours);
    } else if($_hashtag) {
      hashtag.getHashtag($_hashtag, req, res, client, hours);
    } else {
      response = {hi: "use hashtag or profile params on url."};
      res.send(response);
    }

  })()

});

app.set('port', process.env.PORT || 8080);

app.listen(app.get('port'), () => {
    console.log('server runnnig');
});