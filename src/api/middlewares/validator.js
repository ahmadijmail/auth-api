"use strict";

function validator() {
  return (req, res, next) => {
    let regx = /^[a-zA-Z]+$/;
    if (regx.test(req.query.name)) {
      next();
    } else if (req.query.name == "") {
      req.query.name = "no name";
      next("no name");
    } else {
      req.query.name = "Not valid";
      next("not valid");
    }
  };
}

module.exports = validator;
