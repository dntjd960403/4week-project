'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Posts.init({
    postId: {
      primaryKey: true, //기본키로 설정
      type: DataTypes.INTEGER, // 어떤 타입인지
    },
    userId:DataTypes.INTEGER,
    title: DataTypes.STRING,
    nickname: DataTypes.STRING,
    content: DataTypes.STRING,
    likenum: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Posts',
  });
  return Posts;
};