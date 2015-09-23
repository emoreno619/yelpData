$(function(){

	function initialize(){
		var toSend = {}
		toSend.term = "food"
		toSend.location = "San Francisco"
		yelpCall(toSend)
	}


	function yelpCall(toSend){
		
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
						'<a target="_blank" href=/locations/'+ aLoc.id +'>' + aLoc.name + '</a> ' + 
						'<div>'  + aLoc.rating + ' (' + aLoc.review_count + ' reviews)'+ '</div>' +
					'</div>'
					)

			})

		})


	}

	initialize();

})