const express = require('express');
const router = express.Router();
const request = require('request');
const db = require('./models');
const passport = require('./config/ppConfig');
const axios = require('axios')
const querystring = require('querystring');
const { response } = require('express');
let buff = new Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);
let authKey = buff.toString('base64');// changes key to string

router.get('/', (req, res)=>{
    axios.post('https://accounts.spotify.com/api/token',
        querystring.stringify({
            grant_type: 'client_credentials',
        }),
        {
            headers: {
                Authorization: `Basic ${authKey}`
           }
    }).then((response)=>{
        token = response.data.access_token
        const config ={
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        let composer = req.query.composer
        let track = req.query.track
        let query = encodeURIComponent(`${composer} ${track}`)
        axios.get(`https://api.spotify.com/v1/search?q=${query}&type=artist,track&offset=0&limit=20`, config)
        .then((response)=>{
            console.log(response.data)
            let tracks = response.data.tracks.items
            res.render('trackResults', {tracks})
          })
          .catch(err =>{
            console.log(err)
          })
       //use search query in here'
        console.log(token)

      })
    .catch(err=>{
        console.log("error", err.message)
    })
})

router.get('/:id', (req, res)=>{
    // console.log(req.params)
    axios.post('https://accounts.spotify.com/api/token',
    querystring.stringify({
        grant_type: 'client_credentials',
    }),
    {
        headers: {
            Authorization: `Basic ${authKey}`
       }

    }).then((response)=>{
        let token = response.data.access_token
        const config ={
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        console.log(req.params)
        if(req.params.id === '[object Object]'){
            console.log('this is wrong')
        }else{
            console.log(req.params.id)
        }
        let trackId = req.params.id
        // console.log('line 68', trackId)
        try{

            axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, config)
                .then((response)=> {
            console.log('line 71', response.data.album.images[0])
            let result = response.data
                console.log(result)
            db.comment.findAll({
                where: {apiTrackId: req.params.id}//line 74
            }).then((comments)=>{
                res.render('trackDetails', {comments, result})//render found comments db query and result
            })


            }).catch(err=>{
                // console.log('error', err)
            })
        }catch{
            console.log('this')
        }
    })
})



//save faves
router.post('/', (req, res)=>{
    db.track.findOrCreate({ //so i do not duplicate
        where: {apiTrackId: req.body.trackId},
        defaults: {composer: req.body.name}
    }).then(([track, created])=>{
       //find user and add track to them
       db.user.findOne({
           where:{id: req.user.id}//find user id
       })
        .then(user => {
            user.addTrack(track)
            .then(()=>{

                res.redirect('/profile')//redirect to profile
            })

        })
        .catch(err=>{
            console.log('Error', err)
        })
    }).catch(err=>{
        console.log("error", err)
    })

})
router.delete('/:id', async(req, res)=>{
    try{
      await db.usersTracks.destroy({
        where: {
          userId: req.user.id,
          trackId: req.params.id
        },

      });
      res.redirect("/profile")
    }catch(err){
      console.log('Error:', err) // render error

  }

  });



module.exports =router;
