const User = require('../models/users');

exports.userRegisterValidator = (req, res, next) => {
    req.check("username", "Username is required").notEmpty();
    req.check("password", "Password is required").notEmpty();
    req.check("laclass", "Lost Ark class is required").notEmpty();
    req.check("itemlevel", "Item level is required").notEmpty();
    req.check("password").isLength({min: 6}).withMessage("Password is too short");

    const errors = req.validationErrors();

    if(errors){
        const firstError = errors.map((err) => err.msg)[0];
        return res.status(400).json({
            error: firstError
        })
    }

    next();
};

exports.userPreaproveValidator = (req, res, next) => {
    req.check("username", "Username is required").notEmpty();

    const errors = req.validationErrors();

    if(errors){
        const firstError = errors.map((err) => err.msg)[0];
        return res.status(400).json({
            error: firstError
        })
    }
    
    next();
}

exports.isAdminRoleValidator = (req,res,next) => {
    
    if(!req.user.roles.includes(7002)){
        return res.status(404).json({
            error: "Unnauthorized action"
        });
    }

    next();
}

exports.userById = async (req, res, next) => {
    const isEqual = require("react-fast-compare");

    User.findById(req._id).exec((err, user) => {
        if(err || !user){
            return res.status(404).json({
                error: "User not found"
            });
        }

        if(!isEqual(req.roles, user.roles)){
            return res.status(404).json({
                error: "Invalid user roles"
            });
        }

        req.user = user;

        next();
    });
}