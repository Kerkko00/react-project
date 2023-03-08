const jwt = require("jsonwebtoken");

/**
 * Tarkistaa kutsussa saadun tokenin.
 * Palauttaa vastauksena HTTP-viestin 400, mikäli token on virheellinen.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const verifyJWT = async (req, res, next) => {
    const authorization = req.headers.authorization;
    console.log("authorization", authorization);
    if (!authorization) {
        return res.status(400).json({message: "Token is missing from headers"});
    }
    const token = authorization.split(" ")[1];
    try {
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        req.decoded = decodedToken;
        return next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            console.log(token)
            if (!!token) {
                return res.status(400).json({message: "User not logged in"})
            }
            return res.status(400).json({message: "Malformed token"})
        }
    }

}
module.exports = verifyJWT;