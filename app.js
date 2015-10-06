
var express = require('express'),
  app = express(),
  bodyParser = require("body-parser");
  dotenv = require('dotenv').load();

var db = require('./models')
var request = require('request');

// Scrape stuff

var cheerio = require('cheerio');
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until;

var yelp = require("yelp").createClient({
            consumer_key: 'KEFLEf4cm0Xw7vzreOAPLw', 
            consumer_secret: 'KgYfp8CXRq0tSEd7_XCqYmRQr8',
            token: 'F0VfgC9G0VPeXYF8Q4aX8lbOgVKvkfVC',
            token_secret: 'cZe1601_aBo0HYzYzb0hqmEfKBc'
          });

var flag = true;
var baseUrl = 'http://www.yelp.com/'
var addUrl1 = 'search?find_desc=food&find_loc=San+Jose%2C+CA&ns=1'
var nextSearchUrls = ''
var searchResultsCounter = 0;
var locations = []

var scrape = require('./scrape')




app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
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

app.get('/locations/:id', function (req,res){
  db.Location.findOne({where: {id: req.params.id}}).then(function(location){
    db.Review.findAll({where: { locationId: req.params.id}}).then(function(reviews){

      // console.log(reviews)
      var review_text_single = reviews.map(function(aReviewObj){
        return aReviewObj.review
      })

      var review_text_whole = [review_text_single.join(' ')]

      // '["IM SOME DATA", "shit dawg"]'

      request.post('http://52.89.62.23/location', {form: {data: JSON.stringify(review_text_whole)}}, function(error, response, body){
        if (!error && response.statusCode == 200) {
          
          console.log('IN THE POST REQUEST')  
          console.log(body)
          body = JSON.parse(body)


          var arr = []


          body['topics'].forEach(function(topicGroup){
            arr.push(topicGroup)
          })


          // for (var key in body['topics']){
          //   // arr.push([key, body[key]])
          //   for(var top in key)
          //     arr.push(key)
          // }

          // arr = arr.sort(function(a,b){ return b[1] - a[1] })

          console.log(body['topics'])

          reviewsToSend = []

          for (var i = 0; i < 20; i++){
            reviewsToSend.push(reviews[i])
          }

          res.render('show', {location:location , reviews:reviewsToSend, topics:body['topics']})

          // http://127.0.0.1:5000/location
          // http://54.148.31.81/location small model
          // http://52.89.62.23/location  big model

          // request.post('http://127.0.0.1:5000/reviews', {form: {data: JSON.stringify(review_text_single)}}, function(error, response, body){
          //   if (!error && response.statusCode == 200) {

          //     body = JSON.parse(body)

          //     for(var i = 0; i < body.reviewTopics.length; i++){
          //       reviews[i].topics = body.reviewTopics[i]
          //     }

          //     console.log(reviews[0])

          //     res.render('show', {location:location , reviews:reviews, topics:arr})
          //   } else
          //     console.log(error)
          
          // })

        } else
          console.log(error)
      })

    })
  })
})

app.post('/yelp', function (req,res){

  var locsNotInDb = []
  

  yelp.search({term: req.body.term, ll: req.body.ll}, function(error, data) {
      console.log(error);
      console.log("Yelp! returned " + data.businesses.length + " results for that query")
      // create query string

      var y_urls = data.businesses.map(function(aBusiness){
        
        var url = aBusiness.url.slice(19, aBusiness.url.length)

        return url;
      });

      var query = { where: { url_yelp: { $in: y_urls} } }

      //query db

      db.Location.findAll(query).then(function(savedLocations){
        
        //finds which yelp api urls are not stored in db and stores them in arr to be scraped 

        var my_urls = savedLocations.map(function(aBusiness){
          return aBusiness.url_yelp
        })

        y_urls.forEach(function(aY_url){
          if(my_urls.indexOf(aY_url) == -1){
            data.businesses.forEach(function(aLoc){
              if(aLoc.url.slice(19, aLoc.url.length) == aY_url)
                locsNotInDb.push(aLoc)
            })
          }   
        })

        var afterApi = {}
        afterApi.myLocs = savedLocations
        afterApi.locsNotInDb = locsNotInDb

        // call to scrape with locsNotInDb


        // res with found db

        res.send(afterApi)

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
app.listen(process.env.PORT || 3000, function () {
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