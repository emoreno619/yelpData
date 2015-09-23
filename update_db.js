var db = require('./models');

var yelp = require("yelp").createClient({
            consumer_key: "KEFLEf4cm0Xw7vzreOAPLw", 
            consumer_secret: "-KgYfp8CXRq0tSEd7_XCqYmRQr8",
            token: "F0VfgC9G0VPeXYF8Q4aX8lbOgVKvkfVC",
            token_secret: "cZe1601_aBo0HYzYzb0hqmEfKBc"
          });

var yelpApi = {

	ySearch: function(term, city, my_url, db_obj){
		yelp.search({term: term, location: city}, function(error, data) {
		    console.log(error);
		    // console.log(data);

		    var i = 0
		    var matchingLoc = ''
		    
		    if(data.businesses){
			    
			    while(i < data.businesses.length){
			    	
			    	var y_url = data.businesses[i].url.slice(19, data.businesses[i].url.length)
					matchingLoc = ''		    	

					console.log(y_url)
					console.log(my_url)

			    	if (y_url == my_url){
			    		console.log('made it')
			    		matchingLoc = data.businesses[i]
			    		i = data.businesses.length
			    	}

			    	i++  
			    }

			    if(matchingLoc){
			    	yelpApi.extractLatLong(matchingLoc, db_obj)
			    } 

			    // data.businesses.forEach(function(aBusiness){
			    // 	var y_url = aBusiness.url.slice(19, aBusiness.url.length)
			    // 	if (y_url == my_url)
			    // 		return aBusiness  
			    // })
		    }
		  });
	},

	extractLatLong: function(aBusiness, db_obj){
		if(aBusiness.location && aBusiness.location.coordinate){

			var lat = aBusiness.location.coordinate.latitude
			var longitude = aBusiness.location.coordinate.longitude
			db_obj.updateAttributes({lat: lat, long:longitude}).then(function(){ console.log(db_obj.name + " updated!")})
		}		
	},

	ySearch_phone_url: function(name, location, lat, long, db_obj){ //NEED TO STRIP PUNC and ENCODE NAME
		yelp.search({term: name, location: location}, function(error, data) {
		  
		  console.log(error);

		  var phone = '';
		  var yelp_url = '';

		  var i = 0;

		  // console.log("lat: " + lat)
		  // console.log("long: " + long)
		  // console.log(data.businesses[0].location)

		  if(data.businesses){

			  while(i < data.businesses.length){
		  		  if(data.businesses[i].location.coordinate){
			  		  var y_lat = Math.floor(data.businesses[i].location.coordinate.latitude * 1000) / 1000
			  		  var y_long = Math.floor(data.businesses[i].location.coordinate.longitude * 1000) / 1000
			  		  lat = Math.floor(lat * 1000) / 1000
			  		  long = Math.floor(long * 1000) / 1000
			  	  }  

			  	if(y_lat == lat && y_long == long)
			  	{

			  		phone = data.businesses[i].phone
			  		yelp_url = data.businesses[i].url.slice(19, data.businesses[i].url.length)
			  		i = data.businesses.length
			  	}

			  	console.log("phone:" + phone)
			  	console.log("yelp_url:" + yelp_url)

			  	i++
			  }

			  if(phone || yelp_url)
			  	db_obj.updateAttributes({phone: phone, url_yelp: yelp_url}).then(function(){ console.log(db_obj.name + " updated!")})
		 }
		});

	}

}

var db_interact = {

	find_w_url: function(){

		db.Location.findAll({ where: {lat: null} }).then(function(storedLocations){
			
			console.log(storedLocations.length)

			var i = 0;

			var interval = setInterval(function(){

				if(storedLocations[i].name && storedLocations[i].address && storedLocations[i])
					yelpApi.ySearch(storedLocations[i].name, storedLocations[i].address.slice(-5,storedLocations[i].address.length), storedLocations[i].url_yelp, storedLocations[i])

				i++

				if(i >= storedLocations.length)
					clearInterval(interval)

			}, 2000)

			// storedLocations.forEach(function(aLocation){
				
			// 	yelpApi.ySearch(aLocation.name, aLocation.address.slice(-5,aLocation.address.length), aLocation.url_yelp)

			// 	var lat = aBusiness.location.coordinate.latitude
			// 	var longitude = aBusiness.location.coordinate.longitude

			// 	aLocation.updateAttributes({lat:lat, long:longitude }).then({ console.log(aLocation.name + ' updated!')})				
			// })

		})

	},

	find_wout_url: function(){
		db.Location.findAll({ where: {url_yelp: null} }).then(function(storedLocations){
			console.log(storedLocations.length)
			// console.log(storedLocations[0].name)

			var i = 0;

			var interval = setInterval(function(){

				if(storedLocations[i] && storedLocations[i].name && storedLocations[i].address)

					console.log(storedLocations[i].name)
					var name = storedLocations[i].name


					while(name.indexOf('&') != -1){
						if(name.indexOf(';') != -1)
							var substring = name.substring(name.indexOf('&'), name.indexOf(';') +1)
						else
							var substring = name.substring(name.indexOf('&'), name.indexOf('&') +1)	
						name = name.replace(substring,'')
					}


					name = name.replace(/[']/g, '')
					name = name.replace(/[ ]/g, '+')

					if(storedLocations[i].address)
						yelpApi.ySearch_phone_url(name, storedLocations[i].address.slice(-5,storedLocations[i].address.length), storedLocations[i].lat, storedLocations[i].long, storedLocations[i])

				i++

				if(i >= storedLocations.length)
					clearInterval(interval)

			}, 1000)

		})
	},

}

db_interact.find_wout_url();





