var express = require('express'),
  app = express();

var db = require('./models')

var scrape = require('./scrape')

app.set('view engine', 'ejs');

// a "GET" request to "/" will run the function below
app.get("/", function (req, res) {
  // send back the response: 'Hello World'
  

  scrape.getLocationUrls().then(function(locations){
    console.log('app.js!!!!!!!!!!!!!! ' + locations)
  })

  function printEm(locations){
    console.log('app.js!!!!!!!!!!!!!! ' + locations)
  }
  // locations.forEach(function(aLocation, index){
    
  //   if (index != locations.length -1){
  //     db.Location.create({
  //       url_yelp = aLocation.url_yelp,
  //       name = aLocation.name,
  //       review_count = aLocation.review_count;
  //     })
  //   } else {
  //     db.Location.create({
  //       url_yelp = aLocation.url_yelp,
  //       name = aLocation.name,
  //       review_count = aLocation.review_count;
  //     }).then(function (){
  //       db.Location.findAll({}).then(function(storedLocations){
  //         res.render('index', {storedLocations:storedLocations})
  //       })
  //     })
  //   }
  // })


  // db.Location.findAll({}).then(function(Locations){
  // 	console.log(Locations[0].getReviews())
  // 	     Locations[0].getReviews().then(function (rev){ 
  // 			 console.log(rev[0].date)  
  // 			 rev[0].date  
  // 			 res.render('index', {Locations:Locations, rev:rev});
  // 	     }) 
  	
  // });

});

// start the server
app.listen(3000, function () {
  console.log("Starting a server on localhost:3000");
});