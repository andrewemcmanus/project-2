const db = require('./models');
const track = require('./models/song');
const user = require('./models/user');

db.user.findAll().then((user) => {
  console.log(user);
})

db.song.findOrCreate({
  where:
}).then((song) => {

})
