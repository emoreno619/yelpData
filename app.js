var express = require('express'),
  app = express();

app.set('view engine', 'ejs');

// a "GET" request to "/" will run the function below
app.get("/", function (req, res) {
  // send back the response: 'Hello World'
  res.render('index', {name:'Eduardo'});
});

// start the server
app.listen(3000, function () {
  console.log("Starting a server on localhost:3000");
});