const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(config.development.url);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Replay = require('./replay')(sequelize, DataTypes);

module.exports = db;
