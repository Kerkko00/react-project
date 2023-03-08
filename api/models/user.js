/**
 * sequelize tietokantamalli käyttäjälle
 */
const {DataTypes} = require('sequelize');
const sequelize = require("../services/db");
const User = sequelize.define('User', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        validate: {
            len: [4, 20],
        },
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    defaultScope: {
        attributes: {exclude: ['password']},
    },
    scopes: {
        withPassword: {
            attributes: {},
        }
    }
    // Other model options go here
});

module.exports = User;