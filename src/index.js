'use strict';

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const userSchema = require('./auth/models/users');
const food = require("./api/models/food");
const clothes = require("./api/models/clothes");
const Collection = require("./api/models/lib/collection");

const DATABASE_URL = process.env.NODE_ENV === 'test' ? 'sqlite::memory' : process.env.DATABASE_URL;

const DATABASE_CONFIG = process.env.NODE_ENV === 'production' ? {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  }
} : {};

const sequelize = new Sequelize(DATABASE_URL, DATABASE_CONFIG);
const clothesTable = clothes(sequelize, DataTypes);
const foodTable = food(sequelize, DataTypes);

const clothesCollection = new Collection(clothesTable);
const foodCollection = new Collection(foodTable);

module.exports = {
  db: sequelize,
  clothes: clothesCollection,
  food: foodCollection,
  users: userSchema(sequelize, DataTypes),
};