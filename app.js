var express = require('express'),
  app = express();

var db = require('./models')

app.set('view engine', 'ejs');

// a "GET" request to "/" will run the function below
app.get("/", function (req, res) {
  // send back the response: 'Hello World'
  db.Location.findAll({}).then(function(Locations){
  	console.log(Locations[0].getReviews())
  	     Locations[0].getReviews().then(function (rev){ 
  			 console.log(rev[0].date)  
  			 rev[0].date  
  			 res.render('index', {Locations:Locations, rev:rev});
  	     }) 
  	
  });

});

// start the server
app.listen(3000, function () {
  console.log("Starting a server on localhost:3000");
});