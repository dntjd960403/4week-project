'use strict';

const fs = require('fs'); // 파일을 읽어오는 라이브러리
const path = require('path'); // 경로 지정
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename); // __ : 내장
const env = process.env.NODE_ENV || 'development'; // 배포환경에 따라 달라짐
const config = require(__dirname + '/../config/config.json')[env]; 
const db = {};// 시퀄이나 유저 객체 모델링을 담기 위해 객체를 만들어준 것

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
