/**
 * sequelize tietokantamalli postaukselle
 */
const {DataTypes} = require('sequelize');
const sequelize = require("../services/db")
const Post = sequelize.define('Post', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        validate: {
            len: [5, 255],
        },
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(2000),
        validate: {
            len: [15, 2000],
        },
        allowNull: false,
    },
}, {
    // Other model options go here
});

module.exports = Post;