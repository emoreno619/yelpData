// TODO: NULLS SHOW PAGES BREAK~~~~~~~~~~

$(function(){

	$('#myModal').modal('show') 
	$('[data-toggle="popover"]').popover()

	var pos = new google.maps.LatLng(37.7833,-122.4167);

	var map = new google.maps.Map(document.getElementById('map'), {
	    center: pos,
	    zoom: 15,
	    scaleControl: true,
	    mapTypeControl: false
	  });

	var formData = {};
	var toSend = {}
	var location;
	var markers = []



	function initialize(){
		mapStyle()
		checkMapPos(yelpCall)
	}

	function mapStyle(){
		var centerControlDiv = document.createElement('div');
	  	var centerControl = new CenterControl(centerControlDiv, map);


		centerControlDiv.index = 1;
		map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);

		var resDiv = document.getElementById('resDiv');
		var input = document.getElementById('pac-input');
		var searchBox = new google.maps.places.SearchBox(input);
   	    map.controls[google.maps.ControlPosition.TOP_LEFT].push(resDiv);

	}

	function checkMapPos(yelp_callback){
		
		if(formData.location){

	      	var address = formData.location
	      	var geocoder = new google.maps.Geocoder();
	      	geocoder.geocode( { 'address': address}, function(results, status) {
	      	      
	      	      if (status == google.maps.GeocoderStatus.OK) {
	      	        
	      	        location = results[0].geometry.location
	      	        console.log(results[0].geometry.location)
	      	        
	      	        map.setCenter(results[0].geometry.location);

	      	        prepare_toSend();

	      	        yelp_callback()

	      	      } else {
	      	        alert("Geocode was not successful for the following reason: " + status);
	      	      }
	      	    });

      	} else if(navigator.geolocation) {
		    
		    navigator.geolocation.getCurrentPosition(function(position) {
		      
			      pos = new google.maps.LatLng(position.coords.latitude,
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
			toSend.ll = String(Math.floor(location.G * 100000)/100000 ) + "," + String(Math.floor(location.K * 100000)/100000)
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

		google.maps.event.addListener(marker, 'mouseover', function() {

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

				$('.dropdown-menu').append(
					'<li id="yRating">' + 
						'<a href=/locations/'+ aLoc.id +'>' + aLoc.name + '</a> ' + 
						'<div style="padding-left: 15px">'  + 
								aLoc.rating + 
								' (' + aLoc.review_count + ' reviews)'+
						 '</div>' +
					'</li><li class="divider"></li>'
					)
			})
		} else {
			console.log(locArr)

			locArr.forEach(function(aLoc){

				dropPin(aLoc, false)

				$('.dropdown-menu').append(
					'<li id="yRating">' + 
						'<a href='+ aLoc.url +'>' + aLoc.name + '</a> ' + 
						'<div style="padding-left: 15px">'  + 
								aLoc.rating + 
								' (' + aLoc.review_count + ' reviews)'+
						 '</div>' +
					'</li><li class="divider"></li>'
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

	  markers.push(marker)
	}

	$('#searchPlaceForm').submit(function(e){
		e.preventDefault();
		formData.term = $('.formName').val();
		formData.location = $('.formLoc').val();
		$('.formName').val("");
		$('.formLoc').val("");

		$('.dropdown-menu').children().remove();
		clearPins();

		checkMapPos(yelpCall)
	})

	function CenterControl(controlDiv, map) {

	  // Set CSS for the control border.
	  var controlUI = document.createElement('div');
	  controlUI.style.backgroundColor = '#fff';
	  controlUI.style.border = '2px solid #fff';
	  controlUI.style.borderRadius = '3px';
	  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
	  controlUI.style.cursor = 'pointer';
	  controlUI.style.marginBottom = '22px';
	  controlUI.style.marginRight = '22px';
	  controlUI.style.marginTop = '22px';
	  controlUI.style.textAlign = 'center';
	  controlUI.title = 'Click to recenter the map';
	  controlDiv.appendChild(controlUI);

	  // Set CSS for the control interior.
	  var controlText = document.createElement('div');
	  controlText.style.color = 'rgb(25,25,25)';
	  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
	  controlText.style.fontSize = '16px';
	  controlText.style.lineHeight = '38px';
	  controlText.style.paddingLeft = '5px';
	  controlText.style.paddingRight = '5px';
	  controlText.innerHTML = 'Show me!';
	  controlUI.appendChild(controlText);

	  // Setup the click event listeners: simply set the map to Chicago.
	  controlUI.addEventListener('click', function() {
	    map.setCenter(pos);
	    map.setZoom(15);
	  });

	}

	initialize();

})