'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    
    return queryInterface.addColumn(
        'review',
        'is_elite',
        Sequelize.BOOLEAN
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
        'review',
        'is_elite'
      )

    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
