const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('pages/index', {lyrics: null, error: null});
});

app.post('/', function (req, res) {
  let song = req.body.song;
  let artist = req.body.artist;
  let url = `https://api.lyrics.ovh/v1/${artist}/${song}`;
  fetch(url)
    .then(data => data.json())
    .then(data => {
      if (data.lyrics !== undefined) {
        res.render('pages/index', {lyrics: data.lyrics.replace(/\n/g, '<br />'), artist: artist, song: song, error: null});
      } else {
        res.render('pages/index', {lyrics: null, error: data.error});
      }
    })
    .catch(error => {
      console.log('error > ' + error);
      res.render('pages/index', {lyrics: null, error: 'Error, please try again'});
    })
});

app.listen(port, function() {
  console.log('Our app is running on http://localhost:' + port);
});