'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    
    return queryInterface.addColumn(
        'location',
        'location_topics',
        Sequelize.ARRAY(Sequelize.STRING)
      )

    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
        'location',
        'location_topics',
        Sequelize.ARRAY(Sequelize.STRING)
      )

    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
