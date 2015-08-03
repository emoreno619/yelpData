var Sequelize = require('sequelize');

var sequelize = new Sequelize('playdb', 'eduardo', '', {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  
});

module.exports = sequelize;

module.exports.Location = require("./location");
module.exports.Review = require("./review");