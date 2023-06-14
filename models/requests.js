'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Requests extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Requests.belongsTo(models.Users,{foreignKey:{name:'from_username',allowNull:false}})
    }
  }
  Requests.init({
    from_username: DataTypes.STRING,
    status: DataTypes.STRING,
    to_username: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Requests',
  });
  return Requests;
};