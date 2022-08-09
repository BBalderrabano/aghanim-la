const User = require("../models/users");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
  const usernameExists = await User.findOne({
    username: req.body.username,
  });

  const usernamePreaproved = await User.findOne({
    username: req.body.username,
    preaproved: true,
  });

  if (usernameExists && !usernamePreaproved) {
    return res.status(403).json({
      error: "Username is taken and awaiting aproval",
    });
  }

  if (usernameExists) {
    usernameExists.setPassword(req.body.password);
    usernameExists.laclass = req.body.laclass;

    usernameExists.save().catch((error) => {
      res.send(400, "Bad Request");
    });
  } else {
    const user = new User(req.body);
    user.setPassword(req.body.password);

    user.save().catch((error) => {
      res.send(400, "Bad Request");
    });
  }

  res.status(201).json({
    message: usernamePreaproved
      ? "Username already preaproved!"
      : "Signup succesful, awaiting aproval!",
    preaproved: usernamePreaproved ? true : false,
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }).exec((err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: "Invalid username",
      });
    }

    if (!user.validPassword(password)) {
      return res.status(401).json({
        error: "Invalid password",
      });
    }

    if (!user.preaproved) {
      return res.status(401).json({
        error: "User awaiting approval",
      });
    }

    const token = jwt.sign(
      { _id: user._id, roles: user.roles },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.cookie("jwt", token, { httpOnly: true });

    const { username } = user;
    return res.json({
      message: "Login succesfull",
      roles: user.roles,
      laclass: user.laclass,
      username,
    });
  });
};

exports.logout = (req, res) => {
  res.clearCookie("jwt");

  return res.json({
    message: "Logout Succesfull!",
  });
};

exports.getLoggedInUser = (req, res) => {
  const { username } = req.user;

  return res.status(200).json({
    message: "User is still logged in",
    roles: req.user.roles,
    username,
  });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find({
    preaproved: true,
    laclass: { $exists: true },
  }).select({ salt: 0, hashedPassword: 0, updatedAt: 0, createdAt: 0 });

  return res.status(200).json(users);
};

exports.getPendingUsers = async (req, res) => {
  const users = await User.find(
    { $or: [{ preaproved: false }, { laclass: { $exists: false } }] },
    "username laclass"
  );

  return res.status(200).json(users);
};

exports.aproveUser = async (req, res) => {
  const update = {
    preaproved: true,
  };

  User.findByIdAndUpdate(
    req.params.id,
    update,
    {
      new: true,
    },
    function (err, result) {
      if (err) {
        res.status(500).json({
          error: "There was an error approving the user",
        });
      } else {
        res.status(201).json({
          result: {
            _id: result._id,
            enabled: result.enabled,
            laclass: result.laclass,
            roles: result.roles,
            username: result.username,
          },
          message: "Succesfully approved the user!",
        });
      }
    }
  );
};

exports.preaproveUser = async (req, res) => {
  const usernameExists = await User.findOne({
    username: req.body.username,
  });

  if (usernameExists) {
    return res.status(403).json({
      error: "Username already exists",
    });
  }

  const user = new User(req.body);

  user.save().catch((error) => {
    return res.status(400).json({ error: "Error saving the user" });
  });

  res.status(201).json({
    message: "Username preaproved!",
    _id: user._id,
  });
};

exports.updateUser = async (req, res) => {
  const updatedUser = {
    roles: req.body.roles,
    enabled: req.body.enabled,
    laclass: req.body.laclass,
    username: req.body.username
  };

  User.findByIdAndUpdate(req.params.id, updatedUser, function (err, result) {
    if (err) {
      res.status(500).json({
        error: "There was an error updating the user",
      });
    } else {
      res.status(201).json({
        updated: {
          _id: result._id,
          enabled: result.enabled,
          laclass: result.laclass,
          roles: result.roles,
          username: result.username,
        },
        message: "Succesfully updated the user",
      });
    }
  });
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete({ _id: req.params.id })
    .then((deleted) => {
      res.status(201).json({
        message: "Succesfully deleted the user",
        deleted: deleted,
      });
    })
    .catch((error) => {
      res.status(500).send({ error: "There was an error deleting the user" });
    });
};
