exports.classesRegisterValidator = (req, res, next) => {
    req.check("classname", "Classname is required").notEmpty();
    req.check("parentname", "A parent class is required").notEmpty();
    req.check("active", "Class status is required").notEmpty();

    const errors = req.validationErrors();

    if(errors){
        const firstError = errors.map((err) => err.msg)[0];
        return res.status(400).json({
            error: firstError
        })
    }

    next();
};