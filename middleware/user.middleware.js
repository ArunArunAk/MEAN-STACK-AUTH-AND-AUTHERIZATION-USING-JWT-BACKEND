
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log("token token", token+ "\n");
    console.log("authHeader authHeader", authHeader+ "\n");

    if (!token) {
        return res.status(401).send({
            message: "Unauthorized: No token provided"
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).send({
                message: "Token is not valid"
            });
        }
        req.user = user;
        next();
    });
};

const verifyuser = (req, res, next) => {
    verifyToken(req, res, () => {
        console.log("1", req.user.id);
        console.log("2", req.params.id);

        if (req.user.id === req.params.id || req.user.isAdmin) {
            console.log("from authHeader verifyuser");
            next();
        } else {
            return res.status(403).send({
                message: "You are not authenticated"
            });
        }
    });
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(403).send({
                message: "You are not authenticated"
            });
        }
    });
};

module.exports = {
    verifyToken,
    verifyAdmin,
    verifyuser
};
