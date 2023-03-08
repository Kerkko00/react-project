/**
 * sequelize tietokantamalli äänestysäänille
 */
const {DataTypes} = require('sequelize');
const sequelize = require("../services/db");
const Vote = sequelize.define('Vote', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
}, {
    // Other model options go here
});


module.exports = Vote;