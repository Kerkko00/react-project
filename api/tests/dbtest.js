const User = require("../models/user");
const Post = require("../models/post");
const Vote = require("../models/votes");

/**
 * Testit tietokannalle
 * @returns {Promise<void>}
 */
async function testHandler() {
    await User.create({
        username: "testitili",
        password: "123"
    });
    const user = await User.findOne({where: {username: "testitili"}});
    await Post.create({
        title: "testipostaus",
        description: "testdescription",
        userId: user.id
    });
    const post = await Post.findOne({where: {title: "testipostaus"}});
    await Vote.create({
        userId: user.id,
        postId: post.id
    });

}

module.exports = testHandler;