const express = require("express");
const postRouter = express.Router();
const Post = require("../models/post");
const User = require("../models/user");
const Vote = require("../models/votes");
const verifyJWT = require("../services/jwt");

/**
 * Toiminto kaikkien postausten palauttamiseen GET-kutsulla
 */
postRouter.get('/posts', async (req, res) => {
    const posts = await Post.findAll({include: User});
    const votes = await Vote.findAll();
    posts.forEach((post) => {
        const upvotes = votes.filter(v => v.postId === post.id);
        post.setDataValue("upvotes", upvotes.length);
    });
    return res.status(200).json(posts);
});

/**
 * Uuden postauksen luomiseen tarkoitettu POST-kutsu
 */
postRouter.post("/post", verifyJWT, async (req, res) => {
    console.log(req.decoded);
    const {title, description} = req.body;
    if (!title || !description) {
        return res.status(400).json({message: "Missing title or description"})
    }
    try {
        const post = await Post.create({title, description, userId: req.decoded.user.id});
        return res.status(201).json(post);
    } catch (error) {
        return res.status(400).json({message: "Post should be between 15 and 2000 characters"});
    }

});

/**
 * Tietyn postauksen poistamiseen tarkoitettu DELETE-kutsu
 */
postRouter.delete("/post/:id", verifyJWT, async (req, res) => {
    const id = Number(req.params.id)
    const post = await Post.findOne({where: {id: id, userId: req.decoded.user.id}})
    if (post != null) {
        // Poistetaan postauksen tykkäykset
        const postVotes = await Vote.findAll({where: {postId: id}})
        for (let i = 0; i < postVotes.length; i++) {
            await postVotes[i].destroy()
        }
        // Poistetaan postauksen kommentit
        const postComments = await Comment.findAll({where: {postId: id}})
        for (let i = 0; i < postComments.length; i++) {
            await postComments[i].destroy()
        }
        await post.destroy()
        return res.status(200).end()
    }
    return res.status(400).end()
});

/**
 * Jo olemassa olevan postauksen päivittämiseen tarkoitettu PUT-kutsu
 */
postRouter.put("/post/:id", verifyJWT, async (req, res) => {
    const id = Number(req.params.id)
    const post = await Post.findOne({where: {id: id, userId: req.decoded.user.id}})
    if (post != null) {
        post.title = req.body.title
        post.description = req.body.description
        post.save()
        return res.status(200).end()
    }
    return res.status(400).end()
});

module.exports = postRouter;