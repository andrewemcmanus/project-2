const express = require("express");
const router = express.Router();
require("dotenv").config();
const db = require("../models");
const querystring = require("querystring");
// const passport = require('../config/ppConfig');
const axios = require("axios");
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const authKey = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

// USER HOMEPAGE
router.get('/', (req, res) => {
    res.render('user', { tracks: [] })
})


// USER FAVORITES
router.get('/profile', (req, res) => {
    db.favorites.findAll({
        where: {
            userId: req.session.passport.user
        }
    })
    .then((tracks) => {
        // console.log(tracks)
        const spotifyIds = tracks.map(track => {
            return track.spotify_id
        })
        return db.track.findAll({
            where: {
                spotify_id: spotifyIds
            }
        })
    })
    .then((favorites) => {
        res.render('profile', { favorites, tracks: [] })
    })
})

// FIND SONGS
router.get("/:track", (req, res) => {
  axios
    .post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "client_credentials",
      }),
      {
        headers: {
          Authorization: `Basic ${authKey}`,
        },
      }
    )
    .then((response) => {
      let token = response.data.access_token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let track = encodeURIComponent(req.query.track);
      axios
        .get(
          `https://api.spotify.com/v1/search?q=${track}&type=track,track&offset=0&limit=10`,
          config
        )
        .then((response) => {
          let tracks = response.data.tracks.items;
          // console.log(tracks[0].artists[0].name);
          res.render('trackResults', { tracks });
        })
        .catch((err) => {
          console.log(err);
        });
    });
});

// FIND SONGS
// router.get("/:artist", (req, res) => {
//   axios
//     .post(
//       "https://accounts.spotify.com/api/token",
//       querystring.stringify({
//         grant_type: "client_credentials",
//       }),
//       {
//         headers: {
//           Authorization: `Basic ${authKey}`,
//         },
//       }
//     )
//     .then((response) => {
//       let token = response.data.access_token;
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       let track = encodeURIComponent(req.query.track);
//       axios
//         .get(
//           `https://api.spotify.com/v1/search?q=${track}&type=artist,artist&offset=0&limit=10`,
//           config
//         )
//         .then((response) => {
//           console.log(track);
//           let tracks = response.data.tracks.items;
//           for (let i = 0; i < tracks.length; i++) {
//             console.log(tracks[i].artists[i].name);
//           }
//           res.render('user', { tracks });
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     });
// });


// ADD TRACK TO FAVORITES
router.post('/', (req, res) => {
  db.favorite.findOrCreate({
      where: { spotify_id: req.body.id },
      defaults: {
        title: req.body.title,
        artist: req.body.artist,
        preview_url: req.body.preview_url,
      },
    })
    .then((favorite) => {
      db.favorite.findOrCreate({
        where: {
          spotify_id: fave[0].spotify_id,
          userId: req.session.passport.user,
        },
      });
    })
    .catch((err) => {
      console.log(err);
    })
    .then(() => {
      res.redirect('/user');
    });
});

module.exports = router;


// // response.data.tracks.items[0].album.artist
// const express = require('express');
// const router = express.Router();
// const request = require('request');
// const db = require('../models');
// const passport = require('../config/ppConfig');
// const axios = require('axios')
// const querystring = require('querystring');
// const { response } = require('express');
// let buff = new Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);
// let authKey = buff.toString('base64');// changes key to string
//
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
//
// module.exports = router;

// const express = require('express');
// const router = express.Router();
// // const request = require('request');
// const db = require('../models');
// // const passport = require('../config/ppconfig');
// const axios = require('axios');
// const querystring = require('querystring');
// // const { response } = require('express');
//
// let buff = new Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);
// let authKey = buff.toString('base64');
//
// // FIND TRACKS
// router.get("/:track", (req, res) => {
//   axios
//     .post(
//       "https://accounts.spotify.com/api/token",
//       querystring.stringify({
//         grant_type: "client_credentials",
//       }),
//       {
//         headers: {
//           Authorization: `Basic ${authKey}`,
//         },
//       }
//     )
//     .then((response) => {
//       let token = response.data.access_token;
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       let track = encodeURIComponent(req.query.track);
//       axios
//         .get(
//           `https://api.spotify.com/v1/search?q=${track}&type=track,track&offset=0&limit=10`,
//           config
//         )
//         .then((response) => {
//           let tracks = response.data.tracks.items;
//           res.render("profile", { tracks });
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     });
// });

// router.get('/', (req, res) => {
//   // console.log(req.params);
//   axios.post('https://accounts.spotify.com/api/token', querystring.stringify(
//     {
//       grant_type: 'client_credentials'
//     }),
//     {
//       headers: {
//         Authorization: `Basic ${authKey}`,
//         // 'Content-Type': 'application/x-www-form-urlencoded'
//       }
//     }).then((response) => {
//       // let token = response.data.access_token;
//       let token = response.data.tracks.items;
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           // 'Content-Type': 'application/json'
//         }
//       };
//       let track = req.params.tracks;
//       let query = encodeURIComponent(`${title}`); // ${artist}
//       axios.get(`https://api.spotify.com/v1/search?q=${query}&type=artist,track&offset=0&limit=20`, config).then((response) => {
//         let tracks = response.data.tracks.items;
//         // console.log(tracks);
//         res.render('trackResults', { tracks });
//       });
//       // console.log(config);
//     })
//     // let artist = req.query.artist;
// })

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
