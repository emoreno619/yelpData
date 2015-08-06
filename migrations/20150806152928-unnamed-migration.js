'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    
    return queryInterface.createTable('scrapeprogress', { 
      
      id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },

      createdAt: {
            type: Sequelize.DATE
          },
          
      updatedAt: {
            type: Sequelize.DATE
          },    

      locId: Sequelize.INTEGER

    });
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    
    return queryInterface.dropTable('scrapeprogress');

    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
