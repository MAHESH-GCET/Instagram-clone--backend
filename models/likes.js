'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Likes.belongsTo(models.Posts,{foreignKey:{name:'postId',allowNull:false}})
      Likes.belongsTo(models.Users,{foreignKey:{name:'username',allowNull:false}})
    }
  }
  Likes.init({
    Id:{type: DataTypes.INTEGER,primaryKey:true},
    postId: DataTypes.INTEGER,
    username: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Likes',
  });
  return Likes;
};