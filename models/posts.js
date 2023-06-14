'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Posts.belongsTo(models.Users,{foreignKey:{name:'username',allowNull:false}})
      Posts.hasMany(models.Likes,{foreignKey:{name:'postId',allowNull:false}})
      Posts.hasMany(models.Comments,{foreignKey:{name:'postId',allowNull:false}})
    }
  }
  Posts.init({
    postId: {type:DataTypes.INTEGER,primaryKey:true},
    imageUrl: DataTypes.STRING,
    caption: DataTypes.STRING,
    username: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Posts',
  });
  return Posts;
};