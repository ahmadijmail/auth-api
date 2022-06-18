"use strict";

const logger = (req, res, next) => {
  console.log("request:", req.method, req.path);

  next();
};

module.exports = logger;
