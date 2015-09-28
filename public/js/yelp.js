$(function(){

	var map = new google.maps.Map(document.getElementById('map-canvas'), {
	    center: new google.maps.LatLng(37.7833,-122.4167),
	    zoom: 15
	  });

	var formData = {};
	var toSend = {}
	var location;


	function initialize(){

		// yelpCall(toSend)

		checkMapPos(yelpCall)

	}

	function checkMapPos(yelp_callback){
		
		if(formData.location){

	      	var address = formData.city
	      	var geocoder = new google.maps.Geocoder();
	      	geocoder.geocode( { 'address': address}, function(results, status) {
	      	      
	      	      if (status == google.maps.GeocoderStatus.OK) {
	      	        
	      	        location = results[0].geometry.location
	      	        console.log(location)
	      	        
	      	        map.setCenter(results[0].geometry.location);

	      	        prepare_toSend();

	      	        yelp_callback()

	      	      } else {
	      	        alert("Geocode was not successful for the following reason: " + status);
	      	      }
	      	    });

      	} else if(navigator.geolocation) {
		    
		    navigator.geolocation.getCurrentPosition(function(position) {
		      
			      var pos = new google.maps.LatLng(position.coords.latitude,
			                                       position.coords.longitude);

			      map.setCenter(pos);

			      console.log(position)

			      location = position

			      var infowindow = new google.maps.InfoWindow({
			        map: map,
			        position: pos,
			        content: 'Your location.'
			      });

			      prepare_toSend();

			      yelp_callback()
		    });
		} 
	}

	function prepare_toSend(){
		if (formData.term)
			toSend.term = formData.term
		else
			toSend.term = "food"

		if (formData.location)
			toSend.location = formData.location
		else if (location){
			toSend.ll = String(Math.floor(location.coords.latitude * 100000)/100000 ) + "," + String(Math.floor(location.coords.longitude * 100000)/100000)
			console.log(toSend.ll)
		} else
			toSend.location = "San Francisco"
	}


	function yelpCall(){
		
		console.log("HELLLLLLLLLO")

		$.ajax({
				  type: 'POST',
				  url: '/yelp',
				  data: toSend,
				  dataType: 'json'
				})
		.done(function(data) {

			console.log(data)

			data.forEach(function(aLoc){

				$('body').append(
					'<div id=yRating>' + 
						'<a href=/locations/'+ aLoc.id +'>' + aLoc.name + '</a> ' + 
						'<div>'  + 
								aLoc.rating + 
								' (' + aLoc.review_count + ' reviews)'+
								'Lat:' + aLoc.lat + ' Long:' + aLoc.long +
						 '</div>' +
					'</div>'
					)

			})

		})


	}

	initialize();

})