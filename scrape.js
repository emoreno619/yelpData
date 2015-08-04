var request = require('request');
var cheerio = require('cheerio');


var baseUrl = 'http://www.yelp.com/search?find_desc=&find_loc=San+Francisco%2C+CA&ns=1#find_desc=food'
var addUrl = '&start=' // + multiple of 10 < 14480
var searchResultsCounter = 0;

function getLocationUrls(){
	var locations = {}
	var locationUrls = []

	request(baseUrl, function (error, response, html) {
	  if (!error && response.statusCode == 200) {
	    var $ = cheerio.load(html);

	    $('a.biz-name').each(function(i, element){
	    	var a = $(this)
	    	locationUrls.push(a.attr('href'))	
	    })
	    

	    $('span.review-count').each(function(i, element){
	    	var a = $(this)
	    	// locArr.push(a.attr('href'))

	    	locationUrls[i].push(parseInt(a.html()))
	    	// console.log(a.attr('href'))
	    })

	    locationUrls.push(diffLocArr);

	    if(searchResultsCounter < 1){
	    	nextSearchUrls = $('span.current').parent().next('li').children('a').attr('href')
	    	getUrls(call,true)
	    } else {
	    	console.log(locationUrls)
	    	// call(callback, true);
	    }
	    // call(callback);
	    
	  } else {
	  	console.log(error);
	  }
	});

}

