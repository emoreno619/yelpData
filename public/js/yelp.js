// TODO: NULLS SHOW PAGES BREAK~~~~~~~~~~

$(function(){

	var map = new google.maps.Map(document.getElementById('map-canvas'), {
	    center: new google.maps.LatLng(37.7833,-122.4167),
	    zoom: 15
	  });

	var formData = {};
	var toSend = {}
	var location;
	var markers = []


	function initialize(){
		checkMapPos(yelpCall)
	}

	function checkMapPos(yelp_callback){
		
		if(formData.location){

	      	var address = formData.location
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

			      addMarkerUserLoc(pos);

			      // var infowindow = new google.maps.InfoWindow({
			      //   map: map,
			      //   position: pos,
			      //   content: 'Your location.'
			      // });

			      prepare_toSend();

			      yelp_callback()
		    });
		} else {
			prepare_toSend();

			yelp_callback()
		} 
	}

	function prepare_toSend(){
		if (formData.term)
			toSend.term = formData.term
		else
			toSend.term = "food"

		if (formData.location)
			toSend.ll = String(Math.floor(location.H * 100000)/100000 ) + "," + String(Math.floor(location.L * 100000)/100000)
		else if (location){
			toSend.ll = String(Math.floor(location.coords.latitude * 100000)/100000 ) + "," + String(Math.floor(location.coords.longitude * 100000)/100000)
			console.log(toSend.ll)
		} else
			toSend.location = "San Francisco"
	}


	function yelpCall(){

		$.ajax({
				  type: 'POST',
				  url: '/yelp',
				  data: toSend,
				  dataType: 'json'
				})
		.done(function(data) {

			console.log(data)

			buildDomResults(data.myLocs, true);
			buildDomResults(data.locsNotInDb, false);

		})
	}

	function dropPin(aLoc, mine){
		
		if(mine){
			var showRoute = '<a href=/locations/'+ aLoc.id +'>' + aLoc.name + '</a> <br>' + aLoc.rating + ' (' + aLoc.review_count + ' reviews)'
			var lat = parseFloat(aLoc.lat)
			var long = parseFloat(aLoc.long)
		} else {
			var showRoute = '<a href='+ aLoc.url +'>' + aLoc.name + '</a> <br>' + aLoc.rating + ' (' + aLoc.review_count + ' reviews)'
			var lat = parseFloat(aLoc.location.coordinate.latitude)
			var long = parseFloat(aLoc.location.coordinate.longitude)
		}

		var options = {
			map: map,
			position: {lat: lat, lng: long},
			content: showRoute
		}

		var marker = new google.maps.Marker({
		  map: map,
		  position: {lat: lat, lng: long},
		  flag: true
		});

		markers.push(marker)

		google.maps.event.addListener(marker, 'click', function() {

		  if(marker.flag){
		  	marker.infowindow = new google.maps.InfoWindow(options);
		  	marker.infowindow.open(map, this);
		  	marker.flag = !marker.flag
		  } else {
		  	marker.infowindow.close();
		  	marker.flag = !marker.flag
		  }
	
		});
	}

	function clearPins(){
		markers.forEach(function(aMarker){
			aMarker.setMap(null)
		})
	}

	function buildDomResults(locArr, mine){
		
		if(mine){
			locArr.forEach(function(aLoc){

				dropPin(aLoc, true)

				$('#resultsContainer').append(
					'<div id=yRating>' + 
						'<a href=/locations/'+ aLoc.id +'>' + aLoc.name + '</a> ' + 
						'<div>'  + 
								aLoc.rating + 
								' (' + aLoc.review_count + ' reviews)'+
						 '</div>' +
					'</div>'
					)
			})
		} else {
			console.log(locArr)

			locArr.forEach(function(aLoc){

				dropPin(aLoc, false)

				$('#resultsContainer').append(
					'<div id=yRating>' + 
						'<a href='+ aLoc.url +'>' + aLoc.name + '</a> ' + 
						'<div>'  + 
								aLoc.rating + 
								' (' + aLoc.review_count + ' reviews)'+
						 '</div>' +
					'</div>'
					)
			})

		}
	}

	function addMarkerUserLoc(location) {
	  var image = "images/marker-youAreHere.png"

	  var marker = new google.maps.Marker({
	    position: location,
	    map: map,
	    icon: image,
	    animation: google.maps.Animation.DROP
	  });
	}

	$('#searchPlaceForm').submit(function(e){
		e.preventDefault();
		formData.term = $('#name').val();
		formData.location = $('#city').val();
		$('#name').val("");
		$('#city').val("");

		$('#resultsContainer').children().remove();
		clearPins();

		checkMapPos(yelpCall)
	})

	initialize();

})