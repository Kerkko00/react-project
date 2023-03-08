const User = require("../models/user");
const Post = require("../models/post");
const Vote = require("../models/votes");
const Comment = require("../models/comment")
const sequelize = require("./db");

/**
 * Synkronisoi tietokannan sequelizen kanssa.
 * @returns {Promise<void>}
 */
async function syncDBHandler() {
    User.hasMany(Post, {foreignKey: 'userId'});
    User.hasMany(Comment, {foreignKey: 'userId'});
    Post.hasMany(Comment, {foreignKey: 'postId'});
    Comment.belongsTo(User, {foreignKey: 'userId'});
    Comment.belongsTo(Post, {foreignKey: 'postId'});
    Post.belongsTo(User, {foreignKey: 'userId'});
    Vote.belongsTo(Post, {foreignKey: "postId"});
    Vote.belongsTo(User, {foreignKey: "userId"});
    await sequelize.sync();
}

module.exports = syncDBHandler;