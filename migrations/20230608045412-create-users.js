'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      username: {
        type: Sequelize.STRING,
        allowNull:false,
        primaryKey:true
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull:false
      },
      email: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
      },
      password: {
        type: Sequelize.STRING,
        allowNull:false
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      gender: {
        type: Sequelize.STRING,
        allowNull:false
      },
      profileURL: {
        type: Sequelize.STRING
      },
      numberOfFollowers: {
        type: Sequelize.INTEGER,
        defaultValue:0,
        validate:{
          min:{
            args:0,
            message:"Minimun followers should be 0"
          }
        }
      },
      numberOfFollowing: {
        type: Sequelize.INTEGER,
        defaultValue:0,
        validate:{
          min:{
            args:0,
            message:"Minimun following should be 0"
          }
        }
      },
      numberOfPosts: {
        type: Sequelize.INTEGER,
        defaultValue:0,
        validate:{
          min:{
            args:0,
            message:"Minimun posts should be 0"
          }
        }
      },
      bio: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt:{
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};