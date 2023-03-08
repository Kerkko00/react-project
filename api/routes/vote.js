const express = require("express");
const voteRouter = express.Router();
const Vote = require("../models/votes");
const verifyJWT = require("../services/jwt");

/**
 * Toiminto postauksen äänestys POST -kutsulle
 */
voteRouter.post("/vote/:id", verifyJWT, async (req, res) => {
    const postId = Number(req.params.id);
    const userId = req.decoded.user.id;
    if (!postId) {
        return res.status(400).json({message: "No vote id given"});
    }
    const vote = await Vote.findOne({where: {postId: postId, userId: userId}});
    if (!vote) {
        await Vote.create({postId, userId});
        return res.status(201).end();
    }
    return res.status(400).json({message: "User has voted already"})
})

module.exports = voteRouter;