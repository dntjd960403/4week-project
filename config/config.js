require("dotenv").config();
const env = process.env;

const development = {
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  host: env.DB_HOST,
  dialect: env.DB_DIALECT,
};
const test = {
  username: env.DB_USERNAME,
  password: env.DB_NULLPASS,
  database: env.DB_TEST_DB,
  host: env.DB_TEST_HOST,
  dialect: env.DB_DIALECT,
};
const production = {
  username: env.DB_USERNAME,
  password: env.DB_NULLPASS,
  database: env.DB_PRODUCTION_DB,
  host: env.DB_PRODUCTION_HOST,
  dialect: env.DB_DIALECT,
};

module.exports = {development, test, production}