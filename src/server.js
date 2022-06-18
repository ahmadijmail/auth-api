"use strict";

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const errorHandler = require("./error-handlers/500.js");
const notFound = require("./error-handlers/404.js");
const authRoutes = require("./auth/router/index.js");
const notauthrouter = require('../src/api/routes/v1');
const authrouter = require('../src/api/routes/v2');

const app = express();

app.use(cors());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', notauthrouter);
app.use('/api/v2', authrouter);

app.use(authRoutes);

app.use(notFound);
app.use(errorHandler);


module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`we are in Port ${port}`);
    });
  },
};
