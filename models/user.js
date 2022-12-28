'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    userFullName: DataTypes.STRING,
    userEmail: DataTypes.STRING,
    userPassword: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  User.associate = function (models) {
    User.hasMany(models.Task, { foreignKey: "userId" });
  };
  return User;
};