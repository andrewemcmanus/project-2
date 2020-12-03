const axios = require('axios')
const querystring = require('querystring')
let token =''


let buff = new Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);
let authKey = buff.toString('base64');

axios.post('https://accounts.spotify.com/api/token',
    querystring.stringify({
        grant_type: 'client_credentials',
    }),
    {
        headers: {
            Authorization: `Basic ${authKey}`
       }

}).then((response)=>{
    token = response.data.access_token//use search query in
    console.log(token)
  })
.catch(err=>{
    console.log("error", err.message)
})
