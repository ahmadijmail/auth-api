"use strict";

const clothesmodel = (sequelize, DataTypes) =>
    sequelize.define("clothes", {
        name: { type: DataTypes.STRING, required: true },
        color: { type: DataTypes.STRING, required: true },
        size: { type: DataTypes.STRING, required: true }
    });

    module.exports = clothesmodel;
