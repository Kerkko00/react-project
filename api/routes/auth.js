const express = require("express");
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * Rekisteröitymiseen tarkoitettu POST-kutsu.
 * Luo tietokantaan käyttäjän kutsussa saatujen tietojen perusteella.
 */
authRouter.post("/register", async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }
    if (password.length < 8 || password.length > 255) {
        return res.status(400).json({message: "Password should be between 8 and 255 characters"})
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userExists = await User.findOne({where: {username}});
    if (userExists) {
        return res.status(400).json({message: "Username already exists"});
    }
    try {
        const user = await User.create({username, password: hashedPassword});
        const encodedToken = jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: "1h"});
        return res.status(201).json({token: encodedToken, username: user.username});
    } catch (error) {
        return res.status(400).json({message: "Username should be between 4 and 20 characters"});
    }
});

/**
 * Kirjautumiseen tarkoitettu POST-kutsu.
 * Hakee tietokannasta kutsun mukana saaduilla tiedoilla käyttäjää. Mikäli tiedot eivät täsmää tietokannasta löytyviin tietoihin palautetaan vastauksena HTTP-viesti 400.
 */
authRouter.post("/login", async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }
    const user = await User.scope("withPassword").findOne({where: {username}});
    if (!user) {
        return res.status(400).json({message: "User not found"});
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
        return res.status(400).json({message: "Invalid password"});
    }
    const encodedToken = jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: "1h"});
    return res.status(200).json({token: encodedToken, username: user.username});
});

module.exports = authRouter;