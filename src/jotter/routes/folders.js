'use strict';

const express = require('express');
const { Op } = require('sequelize');
const { Folder } = require('../models');
const bearerAuth = require('../auth/middleware/bearer');

const router = express.Router();

// ROUTES====================
router.get('/:folderId', bearerAuth, getFolder);
router.get('/f/:parentId', bearerAuth, getFolders);
router.post('/', bearerAuth, addFolder);
router.patch('/:folderId', bearerAuth, updateFolder);
router.delete('/:folderId', bearerAuth, deleteFolder);


// HANDLERS==================
async function getFolder(req, res, next) {
  try {
    let { folderId } = req.params;
    let folder = await Folder.findOne({
      where: {
        userId: req.user.id,
        id: folderId,
      },
    });
    res.status(200).json(folder);
  } catch (err) {
    next(err);
  }
}

async function getFolders(req, res, next) {
  try {
    let { parentId } = req.params;
    let query = {
      where: {
        userId: req.user.id,
        parentId: parentId === 'null' ? { [Op.is]: null } : parentId,
      },
      order: [['createdAt', 'DESC']],
    };
    let allFolders = await Folder.findAll(query);
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
