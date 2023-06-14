'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comments.belongsTo(models.Posts,{foreignKey:{name:'postId',allowNull:false}})
      Comments.belongsTo(models.Users,{foreignKey:{name:'username',allowNull:false}})
      
    }
  }
  Comments.init({
    commentText: DataTypes.STRING,
    username: DataTypes.STRING,
    postId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comments',
  });
  return Comments;
};