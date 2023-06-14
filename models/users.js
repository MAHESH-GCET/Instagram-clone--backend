'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasMany(models.Posts,{foreignKey:{name:'username',allowNull:false}})
      Users.hasMany(models.Followers,{foreignKey:{name:'username',allowNull:false}})
      Users.hasMany(models.Requests,{foreignKey:{name:'to_username',allowNull:false}})
      Users.hasMany(models.Comments,{foreignKey:{name:'username',allowNull:false}})
      Users.hasMany(models.Likes,{foreignKey:{name:'username',allowNull:false}})
    }
  }
  Users.init({
    username:{type: DataTypes.STRING,
      allowNull:false,
      primaryKey:true
    },
    fullName: {type:DataTypes.STRING,
    allowNull:false
    },
    email: {type:DataTypes.STRING,
    allowNull:false,
    unique:true
    },
    password: {type:DataTypes.STRING,
    allowNull:false
    },
    age: {type:DataTypes.INTEGER,
    allowNull:false
    },
    gender: {type:DataTypes.STRING,
    allowNull:false},
    profileURL: DataTypes.STRING,
    numberOfFollowers: {type:DataTypes.INTEGER,
    defaultValue:0, minValue:0},
    numberOfFollowing: {type:DataTypes.INTEGER,
    defaultValue:0, minValue:0},
    numberOfPosts: {type:DataTypes.INTEGER,
    defaultValue:0, minValue:0},
    bio: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
    timestamps:true
  });
  return Users;
};