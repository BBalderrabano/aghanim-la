const Classes = require("../models/classes");

exports.getAllClasses = async (req, res) => {
  const classes = await Classes.find({});

  return res.status(200).json(classes);
};

exports.getEnabledClasses = async (req, res) => {
  const classes = await Classes.find({ active: true });

  return res.status(200).json(classes);
};

exports.addClass = async (req, res) => {
  const classExists = await Classes.findOne({ classname: req.body.classname });
  console.log(classExists);
  if (classExists) {
    return res.status(403).json({
      error: "Class is already added.",
    });
  }

  const newClassName = new Classes(req.body);

  await newClassName.save();

  res.status(201).json({
    _id: newClassName._id,
    message: "Succesfully added class"
  });
};

exports.updateClass = async (req, res) => {
  const updatedClass = {
    classname: req.body.classname,
    parentname: req.body.parentname,
    active: req.body.active
  };
  
  Classes.findByIdAndUpdate(req.params.id,
    updatedClass,
    function (err, result) {
      if (err) {
        res.status(500).json({
          error: "There was an error updating the class"
        })
      }
      else {
        res.status(201).json({
          result: result,
          message: "Succesfully updated class"
        })
      }
    });
}

exports.deleteClass = async (req, res) => {
  await Classes.findByIdAndDelete({ _id: req.params.id })
    .then(deleted => {
      res.status(201).json({
        message: "Succesfully deleted the class",
        deleted: deleted
      });
    })
    .catch(error => {
      res.status(500).send({ error: "There was an error deleting the class" });
    });
}
