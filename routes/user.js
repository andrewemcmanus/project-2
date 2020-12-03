// response.data.tracks.items[0].album.artist
const express = require('express');
const router = express.Router();
const request = require('request');
const db = require('../models');
const passport = require('../config/ppConfig');
const axios = require('axios')
const querystring = require('querystring');
const { response } = require('express');
let buff = new Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);
let authKey = buff.toString('base64');// changes key to string

// router.get('/', (req, res) => {
//   axios.post('https://accounts.spotify.com/api/token', querystring.stringify(
//     {
//       grant_type: 'client_credentials'
//     }),
//     {
//       headers: {
//         Authorization: `Basic ${authKey}`
//       }
//     }).then((response) => {
//       let token = response.data.access_token;
//       let config = {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       };
//     })
//
//     // let artist = req.query.artist;
//     let title = req.params.title;
//     let query = encodeURIComponent(`${title}`); // ${artist}
//     axios.get(`https://api.spotify.com/v1/search?q=${query}&type=artist,track&offset=0&limit=20`, config).then((response) => {
//       // console.log(response);
//     });
// })

module.exports = router;
