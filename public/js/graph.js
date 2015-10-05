$(function(){

	var list = [['foo', 12], ['bar', 6], ['five', 20], ['different', 10], ['words', 22]]

	var map

	var address = $('#address').html()

	console.log(address)

	makeMap(address)

	var topics = document.getElementById('someId').dataset.config;
	// topics =  [[0.1358955554797558,["chicken",0.004099022819727766],["sweet",0.0035599800847392203],["dish",0.0031888566710227026],["pork",0.00317311423465345],["sauce",0.0030819166722384694]],[0.07142784050209776,["&#xa0;i",0.003987006751789378],["&#xa0;the",0.0036324702745263145],["&#xa0;",0.0026057274981626678],["it&apos;s",0.0025412429649793134],["ordered",0.0024100901594410573]],[0.060751441143363914,["&#xa0;the",0.013202513347261503],["&#xa0;i",0.012010269128152659],["chicken",0.006318292217731867],["tea",0.005422818745803797],["great.",0.005354862545724721]],[0.0503820309035713,["burger",0.029422300580124384],["fries",0.014577619011715014],["burgers",0.01148663562710977],["burger.",0.008928662770770646],["onion",0.008236425796420548]],
	// console.log("Topics " + topics)

	topics = JSON.parse(topics)

	var arrTopics = [];

	topics.forEach(function(aTopic, k){
		var anObj = {}
		anObj.id = k
		anObj.score = parseFloat(aTopic[0])
		anObj.topics = []
		var i = 1
		while(i<6){
			anObj.topics.push(aTopic[i])
			i++
		}

		arrTopics.push(anObj)
	})
	// console.log(arrTopics)

	var scores = [ {word:'foo', score:12},{word:'bar', score:6},{word:'five', score:20},{word:'different', score:10},{word:'words', score:20}]

	// WordCloud(document.getElementById('my_canvas'), { list: list } );

	function cloudMaker(topics){
		// console.log(topics)
		// topics = list

		newArr = []
		max = topics[0][1]

		topics.forEach(function(aTopic, i){
			if(aTopic[1] > max)
				max = aTopic[1]
		})

		topics.forEach(function(aTopic,i){
			anArr = []
			anArr.push(htmlDecode(aTopic[0]))
			anArr.push(aTopic[1] * 40 / max)
			newArr.push(anArr)
		})

		// console.log(newArr)

		WordCloud(document.getElementById('my_canvas'), { list: newArr } );		
	}

	function htmlDecode(value){
	  return $('<div/>').html(value).text();
	}

	var margin = {top: 40, right: 20, bottom: 30, left: 40},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	var formatPercent = d3.format(".0%");

	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");
	    // .tickFormat(formatPercent);

	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	  	// return "<strong>Score:</strong> <span style='color:red'>" + d.topics + "</span>"
	
	    return '<canvas id="my_canvas" width="300" height="300"></canvas>';
	  })

	var svg = d3.select("#topicsDiv").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.call(tip);

	// d3.tsv("data.tsv", type, function(error, data) {
	  x.domain(arrTopics.map(function(d){ return d.id}));
	  y.domain([0, d3.max(arrTopics, function(d) { return d.score; })]);

	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	     .append("text")
	      .style("text-anchor", "end")
	      .text("Topic");

	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Topics Score for this location");

	  svg.selectAll(".bar")
	      .data(arrTopics)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d.id); })
	      .attr("width", x.rangeBand())
	      .attr("y", function(d) { return y(d.score); })
	      .attr("height", function(d) { return height - y(d.score); })
	      .on('mouseover', function(d){tip.show(d); cloudMaker(d.topics)})
	      .on('mouseout', function(d){tip.hide(d); document.getElementById("my_canvas").remove();});

	// });

	function wrap(){
		tip.show()
		cloudMaker()
	}

	function type(d) {
	  d.score = +d.score;
	  return d;
	}

	// var map;

	function addMarkerUserLoc(location) {
	  var image = "images/marker-youAreHere.png"

	  var marker = new google.maps.Marker({
	    position: location,
	    map: map,
	    icon: image,
	    animation: google.maps.Animation.DROP
	  });
	}

	function makeMap2(address){

		var geocoder = new google.maps.Geocoder();
		geocoder.geocode( { 'address': address}, function(results, status) {
		      
		      if (status == google.maps.GeocoderStatus.OK) {
		        
		        
		        console.log(results)

		        map.setCenter(results[0].geometry.location)

		        var marker = new google.maps.Marker({
		          map: map,
		          position: results[0].geometry.location,
		          flag: true
		        });

		      } else {
		        alert("Geocode was not successful for the following reason: " + status);
		      }
		    });		
	};

	function makeMap(position){

		map = new google.maps.Map(document.getElementById('map'), {
			    // center: position,
			    zoom: 15,
			    scaleControl: true,
			    mapTypeControl: false
			  });

		makeMap2(position)

	}

	// var geocoder = new google.maps.Geocoder();
	// geocoder.geocode( { 'address': address}, function(results, status) {
	      
	//       if (status == google.maps.GeocoderStatus.OK) {
	        
	//         location = results[0].geometry.location
	//         console.log(results)

	//         map = new google.maps.Map(document.getElementById('map'), {
	//         	    center: results[0].geometry.location,
	//         	    zoom: 15,
	//         	    scaleControl: true,
	//         	    mapTypeControl: false
	//         	  });

	//       } else {
	//         alert("Geocode was not successful for the following reason: " + status);
	//       }
	//     });

})