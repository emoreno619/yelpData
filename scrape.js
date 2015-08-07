var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var db = require('./models');
//for getLocationUrls

var baseUrl = 'http://www.yelp.com/search?find_desc=&find_loc=San+Francisco%2C+CA&ns=1#find_desc=food&start=10'
var addUrl = '&start=' // + multiple of 10 < 14480
var searchResultsCounter = 0;
var locations = []

//for getLocInfoAndReviews

var baseUrl2 = 'http://www.yelp.com'

var scrape = { 

	 getLocationUrls: function(){
	 	// return new Promise(function (fulfill, reject){

	 		
	 		var locationUrls = []

	 		request(baseUrl, function (error, response, html) {
	 		  if (!error && response.statusCode == 200) {
	 		    var $ = cheerio.load(html);

	 		    for (var i = 0; i < 10; i++)
	 		    	locations.push("")

	 		    // Saves each location's individual name and yelp url from 
	 		    // yelp search results

	 		    $('a.biz-name').each(function(i, element){
	 		    	var a = $(this)
	 		    	aLocation = {}
	 		    	aLocation['url_yelp'] = a.attr('href')
	 		    	aLocation['name'] = a.html()

					// console.log(i)
					// console.log(aLocation)	 		    
	 		    	locations[i] = aLocation

	 		    })
	 		    
	 		    
	 		    // Saves review count for each location

	 		    $('span.review-count').each(function(i, element){
	 		    	var a = $(this)
	 		    	
	 		    	locations[i]['review_count'] = parseInt(a.html())
	 		    	
	 		    })
	 		    
	 		   

	 		    for (var i = 0; i < locations.length; i++){
	 		    	// for (var prop in locations[i])
	 		    		// console.log(locations[i][prop])
	 		    }
	 		    	

	 		    // fulfill(locations);

	 		    // If reaches last url on this page, proceeds to next list of
	 		    // search result urls. Otherwise, calls callback to explore each
	 		    // saved url's individual location page

	 		    // if(searchResultsCounter < 1){
	 		    // 	nextSearchUrls = $('span.current').parent().next('li').children('a').attr('href')
	 		    // 	getUrls(call,true)
	 		    // } else {
	 		    // 	console.log(locations)
	 		    // 	// call(callback, true);
	 		    // }
	 		    // call(callback);
	 		    

	 		  } else {
	 		  	console.log(error);
	 		  }
	 		});

	 	// })
		

	},

	getLocInfo: function(aUrl){
		console.log("Getting Loc Info:" + aUrl)

		var locationSite = 'http://www.yelp.com' + aUrl

		request(locationSite, function (error, response, html) {

			var $ = cheerio.load(html);

			//Location data
			var loc = {}
			loc.url_yelp = aUrl
			//Location scrape

			$('.biz-page-title').each(function (i, element){
				var a = $(this)
				var name = a.html().replace(/[\t\n]/g,"")
				name = name.substring(name.indexOf(name.match(/[a-zA-Z]/)))
				
				var stopIndex;
				for (var i = 0; i < name.length - 1; i++){
					if (name[i] == ' ' && name[i+1] == ' '){
						stopIndex = i;
						i = name.length - 1
					}
				}
				if(stopIndex)
					name = name.substring(0, stopIndex)
				loc.name = name
			})

			$('.biz-main-info, .biz-rating, .rating-very-large, .star-img').each(function (i, element){
							if(i == 3){
								var a = $(this).attr('title')
								loc.rating = parseFloat(a);
							}
			})

			$('.biz-main-info, .biz-rating, .review-count').each(function (i, element){
				var a = $(this).children('span').children('span')
				
				if (a.html())
					loc.review_count = parseInt(a.html())
			})
			
			$('.price-range').each(function (i, element){
				var a = $(this)
				if (i == 0){
					loc.price = a.html()
				}
				
			})

			$('.category-str-list').children('a').each(function (i, element){
				var a = $(this)
				if(loc.category)
					loc.category += ", " + a.html()
				else
					loc.category = a.html()
			})

			$('.street-address').children('address').children('span').each(function (i, element){
				var a = $(this)
				
				if (loc.address){
					loc.address += " " + a.html()
					if (i == 1)
						loc.address += ","
				} else {
					loc.address = a.html()
				}
			})

			$('.biz-phone').each(function (i, element){
				var a = $(this)
				var phone = a.html().replace(/[. \n,-\/#!$%\^&\*;:{}=\-_`~()]/g,"")
				loc.phone = phone
			})

			$('.biz-website').children('a').each(function (i, element){
				var a = $(this)
				loc.url = a.html()
			})

			console.log(loc)

			scrape.writeDbLoc(loc)

			scrape.getLocReviews($, aUrl)
		})
	},

	readLocsFromDb: function(){
		db.Location.findAll({}).then(function(storedLocations){
			for (var j = 0; j < storedLocations.length; j++)
				console.log(storedLocations[j].url_yelp)

			var i = 0;
			var interval = setInterval(function(){
				
								aUrl = storedLocations[i].url_yelp
								scrape.getLocInfo(aUrl)
								
								i++;

								if (i >= storedLocations.length)
									clearInterval(interval)
							}, 10000)


			// storedLocations.forEach(function(aLocation){
			// 	var aUrl = aLocation.url_yelp;
			// 	setTimeout( function(){ getLocInfo(aUrl) }, 2000)
			// })
		})
	},

	getLocReviews: function($, url_yelp, nextReviewPage){
		//Review data
		var reviews = []
		
		for (var i = 0; i < 40; i++)
			reviews.push({})
		
		if (nextReviewPage){

			request('http://www.yelp.com' + nextReviewPage, function (error, response, html) {

				$ = cheerio.load(html);
				console.log("Getting more reviews for loc: " + nextReviewPage)
				reviewScrape($, url_yelp)
			})
		} else if (!$){
			//done. go to next location
			console.log("Done with reviews for loc: " + url_yelp)
			return
		} else {
			console.log("Getting first reviews for loc: " + url_yelp)
			reviewScrape($, url_yelp)
		}
		// console.log(reviews)
	},

	reviewScrape: function($, url_yelp, nextReviewPage){

		$('.user-name .user-display-name').each(function (i, element){
			var aReview = {}
			aReview.user_id = ''
			
			var a = $(this).attr('href')
			aReview.user_id = a
			reviews[i] = aReview

		})

		$('.user-passport-stats').each(function (i, element){
			var aReview = reviews[i]
			var a = $(this)

			// console.log('\n\n\n\n\n' + i + '\n\n\n\n\n')
			// console.log(a.html())

			if(a.children().hasClass('is-elite'))
				aReview.is_elite = true
			else
				aReview.is_elite = false
		})

		$('.i-wrap b').each(function (i, element){
			
			var aReview = reviews[Math.floor(i/2)]

			var a = $(this)
			if(i%2 == 0)
				aReview.user_friend_count = parseInt(a.html())
			else
				aReview.user_review_count = parseInt(a.html())
			
		})

		$('.review-content .star-img').each(function (i, element){

			var aReview = reviews[i]
			var a = $(this)

			aReview.rating = parseFloat(a.attr('title'))
		})

		$('.review-content .rating-qualifier meta').each(function (i, element){
			var aReview = reviews[i]
			var a = $(this)

			aReview.date = a.attr('content')
		})

		$('.review-content p').each(function (i, element){
			var aReview = reviews[i]
			var a = $(this)

			var review = a.html()
			var count = review.split(' ').length

			
			aReview.review_length = count
			aReview.review = review
		})

		scrape.writeDbRev(reviews, url_yelp)

		var nextReviewPage = $('span.current').parent().next('li').children('a').attr('href')
		
		setTimeout(function(){
			scrape.getLocReviews(null,url_yelp,nextReviewPage)
		}, 1000)
	},

	writeDbLoc: function(obj, url_yelp){
		console.log("Writing data about loc:" + obj.name)
			db.Location.findOne({ where: {url_yelp: obj.url_yelp} }).then(function(aLocation){
				aLocation.updateAttributes({ 
					name: obj.name,
					rating: obj.rating,
					review_count: obj.review_count,
					price: obj.price,
					category: obj.category,
					address: obj.address,
					phone: obj.phone,
					url: obj.url
				}).then(function(){})
			})
	},

	writeDbRev: function(obj, url_yelp){
		console.log("Saving reviews for: " + url_yelp)

		db.Location.findOne({ where: {url_yelp: url_yelp} }).then(function(aLocation){

			for (var i = 0; i < obj.length; i++){
				obj[i].locationId = aLocation.id
			}

			db.Scrapeprogress.create({locId: aLocation.id}).then(function(aScrape){
			  
				//does this work?! if so, sweeeeeeet
				db.Review.bulkCreate(obj).then(function(){})

			})

			// reviews.forEach(function(aReview){

			// 	db.Review.create({
			// 		locationId: aLocation.id,

			// 	}).then(function(){})

			// })

		})
	}

}



module.exports = scrape;

scrape.readLocsFromDb();
// scrape.getLocInfo()
// scrape.getLocationUrls()
