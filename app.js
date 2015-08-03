var express = require('express'),
  app = express();

var db = require('./models/index.js')

app.set('view engine', 'ejs');

// a "GET" request to "/" will run the function below
app.get("/", function (req, res) {
  // send back the response: 'Hello World'
  
  db.findAll({}).then(function(Users){
  	console.log(Users[0].dataValues)
  	res.render('index', {Users:Users});
  });
});

// start the server
app.listen(3000, function () {
  console.log("Starting a server on localhost:3000");
});