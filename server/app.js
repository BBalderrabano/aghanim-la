const express = require("express");
const {json, urlencoded} = express;
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();

const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');

// APP
const app = express();

// DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log("DB connection error", err));

// Middlewares
app.use(morgan("dev"));
app.use(cors({ origin: true, credentials: true }));
app.use(json());
app.use(urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressValidator());

// Routes
const userRoutes = require('./routes/user');
app.use("/", userRoutes);

const classesRoutes = require('./routes/classesla');
app.use('/api', classesRoutes);

// Ports
const port = process.env.PORT || 8080;

// Listener
const server = app.listen(port, () =>
  console.log(`Server is running on port ${port}`)
);