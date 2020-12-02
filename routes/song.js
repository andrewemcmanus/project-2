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
  axios.post('https://accounts.spotify.com/api/token', queryString.stringify(
    {
      grant_type: 'client_credentials'
    });
    {
      headers: {
        Authorization: `Basic ${authKey}`
      }
    }).then((response) => {
      let token = response.data.access_token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    }
    let artist = req.query.artist;
    let title = req.query.title;
    let query = encodeURIComponent(`${artist} ${title}`);
    axios.get(`https://api.spotify.com/v1/search?q=${query}&type=artist,track&offset=0&limit=20`, config).then((response) => {
      let tracks = response.data.tracks.items;
      res.render('trackResults', { tracks });
    }

    );


    )
})
