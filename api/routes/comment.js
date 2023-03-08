const express = require("express");
const commentRouter = express.Router();
const Comment = require("../models/comment");

const verifyJWT = require("../services/jwt");
const User = require("../models/user");

/**
 * Uuden postauksen luomiseen tarkoitettu POST-kutsu
 */
commentRouter.post("/comment", verifyJWT, async (req, res) => {
    const {postId, comment} = req.body;
    const user = req.decoded.user
    console.log(comment, user)
    if (comment === undefined || postId === undefined) {
        return res.status(400).json({message: "Comment cannot be empty"})
    }
    try {
        const newComment = await Comment.create({postId: postId, content: comment, userId: user.id});
        return res.status(200).json(newComment)

    } catch (error) {
        return res.status(400).json({})
    }
});
/**
 * Postauksen kommenttien hakuun tarkoitettu GET-kutsu
 */
commentRouter.get('/comments/:id', async (req, res) => {
    const id = Number(req.params.id)
    const comments = await Comment.findAll({where: {postId: id}, include: User});
    console.log(comments)
    return res.status(200).json(comments);
});

module.exports = commentRouter;