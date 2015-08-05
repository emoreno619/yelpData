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
	 		    
	 		    console.log(locations)

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

	getLocInfoAndReviews: function(){
		
		var $ = cheerio.load(fs.readFileSync('./sample_yelp_location_page.html'));

		//Location data
		var loc = {}

		//Review data
		var reviews = []

		$('.biz-page-title').each(function (i, element){
			var a = $(this)
			console.log(a.html())
			var name = a.html().replace(/[\t\n]/g,"")
			name = name.substring(name.indexOf(name.match(/[a-zA-Z]/)))
			// name = name.substring(0,name.lastIndexOf(/[a-zA-Z]/)+1)			
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
							console.log(a)
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

		console.log(loc)
	}

}



module.exports = scrape;

scrape.getLocInfoAndReviews()
// scrape.getLocationUrls()
