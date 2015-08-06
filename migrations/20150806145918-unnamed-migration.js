'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    
    return queryInterface.addColumn(
        'review',
        'review_sentiment',
        Sequelize.DOUBLE
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
        'review_sentiment'
      )
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
