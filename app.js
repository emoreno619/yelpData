//TODO: migration to include review_sentiment and is_elite

var express = require('express'),
  app = express();

var db = require('./models')
var request = require('request');
var cheerio = require('cheerio');
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until;

var flag = true;
var baseUrl = 'http://www.yelp.com/'
var addUrl1 = 'search?find_desc=food&find_loc=San+Jose%2C+CA&ns=1'
var nextSearchUrls = ''
var searchResultsCounter = 0;
var locations = []

var scrape = require('./scrape')

app.set('view engine', 'ejs');

// a "GET" request to "/" will run the function below
app.get("/", function (req, res) {
  // send back the response: 'Hello World'
  

  // scrape.getLocationUrls().done(function(locations){
  //   console.log('app.js!!!!!!!!!!!!!! ' + locations)
  // })

  function printEm(locations){
    console.log('app.js!!!!!!!!!!!!!! ' + locations)
  }
  
  // drive();
  
  // db.Location.findAll({}).then(function(storedLocations){
  //   console.log(storedLocations)
  //   res.render('index', {storedLocations:storedLocations})
  // })

  db.Location.findOne({ where: {url_yelp: '/biz/ikes-place-san-francisco'} }).then(function(aLocation){
    res.render('index', { aLocation:aLocation })
  })


  // db.Location.findAll({}).then(function(Locations){
  // 	console.log(Locations[0].getReviews())
  // 	     Locations[0].getReviews().then(function (rev){ 
  // 			 console.log(rev[0].date)  
  // 			 rev[0].date  
  // 			 res.render('index', {Locations:Locations, rev:rev});
  // 	     }) 
  	
  // });

});

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
          
          // Saves review count for each location

          // $('span.review-count').each(function(i, element){
          //   var a = $(this)
            
          //   locations[i]['review_count'] = parseInt(a.html())
            
          // })
          

          // If reaches last url on this page, proceeds to next list of
          // search result urls. Otherwise, calls callback to explore each
          // saved url's individual location page


          if (searchResultsCounter < 500){
            searchResultsCounter += 1;
            nextSearchUrls = $('span.current').parent().next('li').children('a').attr('href')
            getLocationUrls();
          } else {
            writeLocDb();
          }

          // if(searchResultsCounter < 1400){
          //  searchResultsCounter++;
          //  // nextSearchUrls = $('span.current').parent().next('li').children('a').attr('href')
          //  // getLocationUrls()
          // }else if(searchResultsCounter == 1400){
          //   searchResultsCounter++;
          //   getLocationUrls(writeLocDb)
          // } else {
          //  // console.log(locations)
          //  if(callback)
          //   callback()
          //  // call(callback, true);
          // }
          // call(callback);
          

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