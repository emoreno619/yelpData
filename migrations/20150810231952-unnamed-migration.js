'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    
    return queryInterface.changeColumn(
      'review',
      'user_friend_count',
      {
        type: Sequelize.STRING
      }
      )
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    
    return queryInterface.changeColumn(
      'review',
      'user_friend_count',
      {
        type: Sequelize.INTEGER
      }
      )

    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
