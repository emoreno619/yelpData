var Sequelize = require('sequelize');
var dotenv = require('dotenv').load();

var sequelize = new Sequelize(process.env.DB_NAME || 'true_backup_allreviews', process.env.DB_USER || 'eduardo', process.env.DB_PASS || '', {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  
});

// var sequelize = new Sequelize('true_backup_allreviews', 'eduardo', '', {
//   host: 'localhost',
//   dialect: 'postgres',

//   pool: {
//     max: 5,
//     min: 0,
//     idle: 10000
//   },
  
// });

var Location = sequelize.define('location', {
  url_yelp: {
    type: Sequelize.TEXT
    // unique: true
  },
  name: {
    type: Sequelize.STRING
  },
  address: {
    type: Sequelize.STRING
  },
  phone: {
    type: Sequelize.STRING
  },
  rating: {
    type: Sequelize.DOUBLE
  },
  review_count: {
    type: Sequelize.INTEGER
  },
  price: {
    type: Sequelize.STRING
  },
  url: {
    type: Sequelize.STRING
  },
  senti_total: {
    type: Sequelize.DOUBLE
  },
  senti_ave: {
    type: Sequelize.DOUBLE
  },
  senti_max: {
    type: Sequelize.DOUBLE
  },
  senti_min: {
    type: Sequelize.DOUBLE
  },
  category: {
    type: Sequelize.STRING
  },
  lat: {
    type: Sequelize.DOUBLE
  },
  long: {
    type: Sequelize.DOUBLE
  },
  our_rating: {
    type: Sequelize.DOUBLE
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

var Review = sequelize.define('review', {
  date: {
    type: Sequelize.STRING
  },
  user_id: {
    type: Sequelize.STRING
  },
  user_review_count: {
    type: Sequelize.INTEGER
  },
  user_friend_count: {
    type: Sequelize.INTEGER
  },
  rating: {
    type: Sequelize.DOUBLE
  },
  review: {
    type: Sequelize.TEXT
  },
  review_length: {
    type: Sequelize.INTEGER
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

var Scrapeprogress = sequelize.define('scrapeprogress', {
  locId: {
    type: Sequelize.INTEGER
  }
}, {
  freezeTableName: true
});


// Review.belongsTo(Location)
Location.hasMany(Review)

// Location.hasMany(Review)

// Location.sync().then(function () {

// 	Location.create({
// 	  url_yelp: 'test location'
// 	});
 
//   	Review.sync().then(function () {
 
//    		return Review.create({
//    			date: 'test review',
//    			locationId: 1
//    		});
//   	});

// });

// Location.hasMany(Review)

// module.exports = Location;

module.exports = sequelize;

module.exports.Scrapeprogress = Scrapeprogress;
module.exports.Location = Location;
module.exports.Review = Review;