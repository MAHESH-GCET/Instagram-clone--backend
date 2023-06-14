'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Requests','requests_ibfk_1');
    await queryInterface.addConstraint('Requests',{
      fields:['from_username'],
      type:'foreign key',
      references:{
        table:'Users',
        field:'username'
      },
      onDelete:'CASCADE',
      onUpdate:'CASCADE'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Requests', 'Requests_from_username_fkey');
    await queryInterface.addConstraint('Requests', {
      fields: ['to_username'],
      type: 'foreign key',
      references: {
        table: 'Users',
        field: 'username'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      name: 'Requests_to_username_fkey'
    });
  }
};
