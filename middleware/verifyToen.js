const jwt = require('jsonwebtoken');
require('dotenv').config();



const verifytoken = (req, res, next) => {
    const token = req.cookies.access_token;
    console.log(token, "from verifytoken");

    if (!token) {
        return res.status(403).send({
            message: "You are not authenticated"
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).send({
                message: "Token is not valid"
            });
        }
        console.log("usersssssssssss",user )
        req.user = user;
        next();
    });
};

const verifyuser = (req, res, next) => {
    verifytoken(req, res, () => {
        console.log("1", req.user.id);
        console.log("2", req.params.id);

        if (req.user.id === req.params.id || req.user.isAdmin) {
            console.log("from verifyuser");
            next();
        } else {
            return res.status(403).send({
                message: "You are not authenticated"
            });
        }
    });
};

const verifyAdmin = (req, res, next) => {
    verifytoken(req, res, () => {
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
    verifyuser ,
    verifyAdmin

}