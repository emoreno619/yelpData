// var Sequelize = require('sequelize');
// var sequelize = require('./index')
// var Review = require('./review')

// var Location = sequelize.define('location', {
//   url_yelp: {
//     type: Sequelize.STRING,
//     unique: true
//   },
//   name: {
//     type: Sequelize.STRING
//   },
//   address: {
//     type: Sequelize.STRING
//   },
//   phone: {
//     type: Sequelize.STRING
//   },
//   rating: {
//     type: Sequelize.DOUBLE
//   },
//   review_count: {
//     type: Sequelize.INTEGER
//   },
//   price: {
//     type: Sequelize.STRING
//   },
//   url: {
//     type: Sequelize.STRING
//   },
//   senti_total: {
//     type: Sequelize.DOUBLE
//   },
//   senti_ave: {
//     type: Sequelize.DOUBLE
//   },
//   senti_max: {
//     type: Sequelize.DOUBLE
//   },
//   senti_min: {
//     type: Sequelize.DOUBLE
//   },
//   category: {
//     type: Sequelize.STRING
//   },
//   lat: {
//     type: Sequelize.DOUBLE
//   },
//   long: {
//     type: Sequelize.DOUBLE
//   },
//   our_rating: {
//     type: Sequelize.DOUBLE
//   }
// }, {
//   freezeTableName: true // Model tableName will be the same as the model name
// });

// // Location.hasMany(Review)

// Location.sync({force: true}).then(function () {
//   // Table created
//   return Location.create({
//     url_yelp: 'test location'
//   });
// });

// // Location.hasMany(Review)

// module.exports = Location;