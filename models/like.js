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
    }
  }
  Likes.init({
    likeId: {
      primaryKey: true, //기본키로 설정
      type: DataTypes.INTEGER, // 어떤 타입인지
    },
    postId: DataTypes.INTEGER,
    nickname: DataTypes.STRING,
    doneAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Likes',
  });
  return Likes;
};