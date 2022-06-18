'use strict';

const express = require('express');
const dataModules = require('../../index');
const bearer = require('../../auth/middleware/bearer');
const permissions = require('../../auth/middleware/acl')


const authrouter = express.Router();

authrouter.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

authrouter.get('/:model', bearer, permissions('read'), handleGetAll);
authrouter.get('/:model/:id',bearer, permissions('read'), handleGetOne);
authrouter.post('/:model', bearer, permissions('create'), handleCreate);
authrouter.put('/:model/:id',bearer, permissions('update'), handleUpdate);
authrouter.delete('/:model/:id',bearer, permissions('delete'), handleDelete);

async function handleGetAll(req, res) {
  let allRecords = await req.model.read();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theRecord = await req.model.read(id)
  res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj)
  res.status(201).json(updatedRecord);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  res.status(204).json(deletedRecord);
}


module.exports = authrouter;