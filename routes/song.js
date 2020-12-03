const express = require('express');
const router = express.Router();
const request = require('request');
const db = require('../models');
const passport = require('../config/ppconfig');
const axios = require('axios');
const querystring = require('querystring');
const { response } = require('express');

let buff = new Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);
let authKey = buff.toString('base64');

router.get('/', (req, res) => {
  axios.post('https://accounts.spotify.com/api/token', querystring.stringify(
    {
      grant_type: 'client_credentials'
    }),
    {
      headers: {
        Authorization: `Basic ${authKey}`
      }
    }).then((response) => {
      let token = response.data.access_token;
      let config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      let title = req.params.title;
      let query = encodeURIComponent(`${title}`); // ${artist}
      axios.get(`https://api.spotify.com/v1/search?q=${query}&type=artist,track&offset=0&limit=20`, config).then((response) => {
        let tracks = response.data.tracks.items;
        res.render('trackResults', { tracks });
      });
      // console.log(config);
    })
    // let artist = req.query.artist;
})

// router.post('/', (req, res) => {
//     // console.log(req.body)
//     // console.log(req.body.id)
//     // console.log(req.body.title)
//     // console.log(req.body.artist)
//     // console.log(req.body.durationMs)
//     // console.log(req.body.preview_url)
//     db.track.findOrCreate({
//         where: { spotify_id: req.body.id },
//         defaults: {
//             title: req.body.title,
//             artist: req.body.artist,
//             durationMs: req.body.durationMs,
//             explicit: req.body.explicit,
//             preview_url: req.body.preview_url
//         }
//     })
//     .then((req, res) => {
//         console.log(`console req ${req}`);
//         console.log(`console res ${res}`);
//     })
//     .then(() => {
//         res.redirect('/user')
//     })
// .catch((err) => {
//     console.log(err)
// })
// });

module.exports = router;
