const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    let accessToken = req.cookies.jwt;

    if(!accessToken){
        return res.status(403).json({
            error: "You are not logged in"
        });
    }

    let payload

    try{
        payload = jwt.verify(accessToken, process.env.JWT_SECRET);
        req._id = payload._id;
        req.roles = payload.roles;

        next();
    }catch(e){
        return res.status(403).json({
            error: "You are not logged in"
        });
    }
}