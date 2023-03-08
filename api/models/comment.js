/**
 * sequelize tietokantamalli kommentille
 */
const {DataTypes} = require('sequelize');
const sequelize = require("../services/db")
const Comment = sequelize.define('Comment', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    content: {
        type: DataTypes.STRING(2000),
        allowNull: false,
    },
}, {
    // Other model options go here
});

module.exports = Comment;