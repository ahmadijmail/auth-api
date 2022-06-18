'use strict';

const express = require('express');
const authRouter = express.Router();

const basic = require('../middleware/basic.js');
const bearer = require('../middleware/bearer.js');
const permissions = require('../middleware/acl.js')

const {
  handelhome,
  handleSignin,
  handleSignup,
  handleGetUsers,
  handleSecret, 

} = require('./handlers.js');

authRouter.get('/', handelhome);
authRouter.post('/signup', handleSignup);
authRouter.post('/signin', basic, handleSignin);
authRouter.get('/secret', bearer, handleSecret);
authRouter.get('/users', bearer,  permissions('delete'), handleGetUsers);


module.exports = authRouter;
