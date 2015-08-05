var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
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

	getLocInfo: function(){
		
		var $ = cheerio.load(fs.readFileSync('./sample_yelp_location_page.html'));

		//Location data
		var loc = {}

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

		// console.log(loc)

		scrape.writeDB(loc)

		scrape.getLocReviews($)
	},

	getLocReviews: function($){
		//Review data
		var reviews = []
		for (var i = 0; i < 40; i++)
			reviews.push({})
		

		$('.user-name .user-display-name').each(function (i, element){
			var aReview = {}
			aReview.user_id = ''
			var a = $(this).attr('href')
			aReview.user_id = a
			reviews[i] = aReview
		})

		console.log(reviews)
	},

	writeDB: function(obj){
		// console.log(obj)
	}

}



module.exports = scrape;

scrape.getLocInfo()
// scrape.getLocationUrls()
