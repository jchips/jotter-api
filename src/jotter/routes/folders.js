'use strict';

const express = require('express');
const { Folder } = require('../models');
const bearerAuth = require('../auth/middleware/bearer');

const router = express.Router();

// ROUTES====================
router.get('/', bearerAuth, getFolders);
router.post('/', bearerAuth, addFolder);
router.patch('/:folderId', bearerAuth, updateFolder);
router.delete('/:folderId', bearerAuth, deleteFolder);


// HANDLERS==================
async function getFolders(req, res, next) {
  try {
    let allFolders = await Folder.findAll({ where: { userId: req.user.id } });
    res.status(200).json(allFolders);
  } catch (err) {
    next(err);
  }
}

async function addFolder(req, res, next) {
  try {
    let newFolder = req.body;
    let add = await Folder.create(newFolder);
    res.status(201).json(add);
  } catch (err) {
    next(err);
  }
}

async function updateFolder(req, res, next) {
  try {
    let { folderId } = req.params;
    let newUpdates = req.body;
    let folder = await Folder.findOne({ where: { id: folderId } });
    let update = await folder.update(newUpdates);
    res.status(200).json(update);
  } catch (err) {
    next(err);
  }
}

async function deleteFolder(req, res, next) {
  try {
    let { folderId } = req.params;
    await Folder.destroy({ where: { id: folderId } });
    res.status(200).json({ message: 'deleted folder' });
  } catch (err) {
    next(err);
  }
}

module.exports = router;
