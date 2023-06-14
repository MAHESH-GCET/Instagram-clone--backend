'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Likes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username:{
        type:Sequelize.STRING,
        allowNull: false,
        references:{
          model:'Users',
          key:'username'
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
      },
      postId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Posts',
          key:"postId"
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Likes');
  }
};