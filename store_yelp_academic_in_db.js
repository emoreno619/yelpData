
var db = require('./models');
var fs = require('fs');

var arrOfObj = []

var db_interact = {

	LocReader: function(){

		var rl = require('readline').createInterface({
		  input: require('fs').createReadStream('/Users/eduardo/Downloads/yelp_dataset_challenge_academic_dataset/yelp_academic_dataset_business.json')
		});


		rl.on('line', function (line) {
			loc_obj = JSON.parse(line)

			var categories = ''

			for(var i = 0; i < loc_obj.categories.length; i++){ 

				if(i != loc_obj.categories.length - 1)
					categories = categories + loc_obj.categories[i] + ', '
				else
					categories = categories + loc_obj.categories[i]
			}

			var address = loc_obj.full_address.replace('\n',' ')

			console.log(address)


			var aLoc = {}

			if (loc_obj.name)
				aLoc.name = loc_obj.name
			if (loc_obj.stars)
				aLoc.rating = loc_obj.stars
			if (loc_obj.review_count)
				aLoc.review_count = loc_obj.review_count
			if (loc_obj.attributes && loc_obj.attributes['Price Range'])
				aLoc.price = String(loc_obj.attributes['Price Range'])
			if (loc_obj.categories)
				aLoc.category = categories
			if (loc_obj.full_address)
				aLoc.address = address
			if (loc_obj.latitude)
				aLoc.lat = loc_obj.latitude
			if (loc_obj.longitude)
				aLoc.long = loc_obj.longitude

			arrOfObj.push(aLoc)

			console.log(aLoc)
	
		});

		rl.on('close', function(){
			db_interact.writeDbLoc()
		})
	},

	ReviewReader: function(){

		var rl = require('readline').createInterface({
		  input: require('fs').createReadStream('/Users/eduardo/Downloads/yelp_dataset_challenge_academic_dataset/yelp_academic_dataset_review.json')
		});


		rl.on('line', function (line) {
			review_obj = JSON.parse(line)

			var categories = ''

			var aReview = {}

			if (review_obj.date)
				aReview.date = review_obj.date
			if (review_obj.stars)
				aReview.rating = review_obj.stars
			if (review_obj.review)
				aReview.review = review_obj.text
			if (review_obj.review)
				aReview.review_length = review_obj.text.length
			if (review_obj.latitude)
				aReview.lat = review_obj.latitude
			if (review_obj.longitude)
				aReview.long = review_obj.longitude

			arrOfObj.push(aReview)
	
		});

		rl.on('close', function(){
			console.log('Writing to DB...')
			db_interact.writeDbRev()
		})
	},


	writeDbLoc: function(){

		db.Location.bulkCreate(arrOfObj).then(function(){})
	
	},

	writeDbRev: function(){
					  
		db.Review.bulkCreate(arrOfObj).then(function(){ console.log('Done writing to DB.')})

	}
}

// db_interact.ReviewReader()
db_interact.LocReader();