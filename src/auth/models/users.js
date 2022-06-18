"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = (sequelize, DataTypes) => {
  const model = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    token: {
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign({ username: this.username }, process.env.API_SECRET);
      },
      set(tokenObj) {
        let token = jwt.sign(tokenObj, process.env.API_SECRET);
        return token;
      }
    },

    role: {
      type: DataTypes.ENUM('admin', 'writer', 'editor', 'user'),
      defaultValue: 'user',
  },
  
    capabilities: {
      type: DataTypes.VIRTUAL,
      get() {
        const acl = {
          user: ['read'],
          writer: ['read', 'create'],
          editor: ['read', 'create', 'update'],
          admin: ['read', 'create', 'update', 'delete']
        };
        return acl[this.role];
      }
    }


  });

  model.beforeCreate = async function (password) {
    let hashedPass = await bcrypt.hash(password, 10);

    return hashedPass;
  };

  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({
      where: { username: username },
    });

    const valid = await bcrypt.compare(password, user.password);

    if (valid) {
      return user;
    }
    throw new Error("Invalid User");
  };

  model.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token, process.env.API_SECRET);

      const user = this.findOne({ where: { username: parsedToken.username } });

      if (user) {
        return user;
      }
      throw new Error("User Not Found");
    } catch (e) {
      throw new Error(e.message);
    }
  };

  return model;
};

module.exports = userSchema;
