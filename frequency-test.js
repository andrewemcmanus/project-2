// 1. stream frequency data from player
// 2. calculate rolling average
// 3. write to database (a PUT request for the songid)

// app.put('/dinosaurs/:idx', function(req, res){
//   var dinosaurs = fs.readFileSync('./dinosaurs.json');
//   dinosaurs = JSON.parse(dinosaurs);
//
//   //re-assign the name and type fields of the dinosaur to be editted
//   dinosaurs[req.params.idx].name = req.body.name;
//   dinosaurs[req.params.idx].type = req.body.type;
//
//    // save the editted dinosaurs to the data.json file
//   fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinosaurs));
//   res.redirect('/dinosaurs');
// });

// does the local frequency data REPLACE the GET request? Does it obviate the need for it?


// const freqData = [];
// for (var i = 1; i < freqData.length; i++)
// {
//     var rollingAvg = (freqData[i] + freqData[i-1] + freqData[i+1])/3.0;
// then push to the database here?
//     moveMean.push([i,mean]);
// }

function rollingAvg(input) {
  for (let i = 1; i < input.length; i++) {
    let rollingAvg = (input[i] + input[i+1] + input[i-1])/3.0;
  }
  return rollingAvg;
};

router.put('/profile/:songid', (req, res) => {
  let averages = fs.readFileSync('./dinosaurs.json');
  averages = JSON.parse(averages); // or "songs"?
  averages[req.params.songid].average = rollingAvg;
  // fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinosaurs));
  
  // then return the average...
  res.redirect('/profile');

})
