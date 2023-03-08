/**
 * Yhteys SQL-tietokantaan sequelize kirjastolla
 */
const {Sequelize} = require('sequelize');
const sequelize = new Sequelize(`mariadb://samulu:${process.env.DATABASE_PASSWORD}@mysql.metropolia.fi:3306/samulu`);
module.exports = sequelize;