"use strict";

const { users } = require("../../index");

function handelhome(req, res) {
  res.status(200).send("Hello User");
}

async function handleSignup(req, res, next) {
  try {
    users
      .beforeCreate(req.body.password)
      .then(async (hashedPass) => {
        let userRecord = await users.create({
          username: req.body.username,
          password: hashedPass,
          role:req.body.role,
        });

        const output = {
          user: userRecord,
          token: userRecord.token,
        };

        res.status(201).json(userRecord);
      })
      .catch((e) => {});
  } catch (e) {
   
    next(e);
  }
}

async function handleSignin(req, res, next) {
  try {
    const user = {
      user: req.user,
      token: req.user.token,
    };

    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
}

async function handleGetUsers(req, res, next) {
  try {
    const userRecords = await users.findAll({});
    const list = userRecords.map(user => user.username);
    res.status(201).json(list);
  } catch (e) {
    console.error(e);
    next(e);
  }
}

function handleSecret(req, res, next) {
  res.status(200).send("Welcome to the secret area!");
}



module.exports = {
  
  handelhome,
  handleSignup,
  handleSignin,
  handleGetUsers,
  handleSecret,
};
