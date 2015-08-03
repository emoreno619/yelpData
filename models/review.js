var sequelize = require('./index')
var Location = require('./location')

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

Location.hasMany(Review)

Review.sync({force: true}).then(function () {
  // Table created
  return Review.create({
    date: 'test review'
  });
});