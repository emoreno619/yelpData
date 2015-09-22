
var express = require('express'),
  app = express();

var db = require('./models')
var request = require('request');

// Scrape stuff

var cheerio = require('cheerio');
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until;

var yelp = require("yelp").createClient({
            consumer_key: "KEFLEf4cm0Xw7vzreOAPLw", 
            consumer_secret: "-KgYfp8CXRq0tSEd7_XCqYmRQr8",
            token: "F0VfgC9G0VPeXYF8Q4aX8lbOgVKvkfVC",
            token_secret: "cZe1601_aBo0HYzYzb0hqmEfKBc"
          });

var flag = true;
var baseUrl = 'http://www.yelp.com/'
var addUrl1 = 'search?find_desc=food&find_loc=San+Jose%2C+CA&ns=1'
var nextSearchUrls = ''
var searchResultsCounter = 0;
var locations = []

var scrape = require('./scrape')





app.set('view engine', 'ejs');


app.get("/", function (req, res) {

  res.render('index')

  // yelp.search({term: "Sushirrito", location:"94108"}, function(error, data) {
  //   console.log(error);
    
  //   data.businesses.forEach(function(aBusiness){
  //     console.log(aBusiness.id)
  //     console.log(aBusiness.location.coordinate)
  //   })

  //   res.render('index', {data:data})
  // });
  
  // db.Location.findAll({}).then(function(storedLocations){
  //   console.log(storedLocations)
  //   res.render('index', {storedLocations:storedLocations})
  // })

  // db.Location.findOne({ where: {url_yelp: '/biz/ikes-place-san-francisco'} }).then(function(aLocation){
  //   res.render('index', { aLocation:aLocation })
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

app.post('/yelp', function (req,res){

  var locsNotInDb = []
  

  yelp.search({term: req.body.term, location: req.body.location}, function(error, data) {
    console.log(error);
     
      console.log(aBusiness.id)

      var url_yelp = aBusiness.url.slice(19, aBusiness.url.length)
    
      // create query string

      var y_urls = data.businesses.map(function(aBusiness){
        return aBusiness.url;
      });

      var query = { where: { url_yelp: { $in: y_urls} } }

      //query db

      db.Location.findAll(query).then(function(savedLocations){
        
        //finds which yelp api urls are not stored in db and stores them in arr to be scraped 

        var my_urls = savedLocations.map(function(aBusiness){
          return aBusiness.url_yelp
        })

        y_urls.forEach(function(aY_url){
          if(my_urls.indexOf(aY_url) == -1)
            locsNotInDb.push(aY_url)
        })

        // call to scrape with locsNotInDb


        // res with found db

        res.send(savedLocations)

      })

    // res.send(data.businesses)
  });

})

app.get('/scrape', function (req, res){
  db.Scrapeprogress.create({locId:100}).then(function(aScrape){
    console.log("BOOOOOOOOOOOOOOOOOOOOOOOP" + aScrape)
  })
  res.redirect('/')
})

// start the server
app.listen(3000, function () {
  console.log("Starting a server on localhost:3000");
});



// Scrape functions....I think scape.js is better / more up to date

function drive(){
  var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

  if (searchResultsCounter == 0)
    var url = baseUrl + addUrl1
  else{
    var addUrl2 = '&start=' + (searchResultsCounter * 10)// + multiple of 10 < 14480
    var url = baseUrl + addUrl1 + addUrl2
  }

  driver.get(url);

  var page = driver.wait(function() {
    return driver;
  }, 500);

  console.log(page)

  // getLocationUrls();

  driver.quit();
}

function getLocationUrls(callback){
    
      
      var locationUrls = []

      if (searchResultsCounter == 0)
        var url = baseUrl + addUrl1
      else{
        // var addUrl2 = '&start=' + (searchResultsCounter * 10)// + multiple of 10 < 14480
        var url = baseUrl + nextSearchUrls
      }
        

      request(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
          var $ = cheerio.load(html);


          // Saves each location's individual name and yelp url from 
          // yelp search results

          $('a.biz-name').each(function(i, element){
            var a = $(this)
            aLocation = {}
            aLocation['url_yelp'] = a.attr('href')
            aLocation['name'] = a.html()
            locations.push(aLocation)
          })

          if (searchResultsCounter < 500){
            searchResultsCounter += 1;
            nextSearchUrls = $('span.current').parent().next('li').children('a').attr('href')
            getLocationUrls();
          } else {
            writeLocDb();
          }

        } else {
          console.log(error);
        }
      

    })
}

function writeLocDb(){
  flag = false;
  locations.forEach(function(aLocation, index){
    
      if (index != locations.length -1){
        db.Location.create({
          url_yelp : aLocation.url_yelp,
          name : aLocation.name,
          review_count : aLocation.review_count
        })
      } else {
        db.Location.create({
          url_yelp : aLocation.url_yelp,
          name : aLocation.name,
          review_count : aLocation.review_count
        }).then(function (){
          db.Location.findAll({}).then(function(storedLocations){
            return storedLocations
            // res.render('index', {storedLocations:storedLocations})
          })
        })
      }
  
  })
}