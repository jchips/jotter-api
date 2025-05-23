'use strict';

const express = require('express');
const { Sequelize, Op } = require('sequelize');
const { Folder, Config } = require('../models');
const db = require('../db');
const bearerAuth = require('../auth/middleware/bearer');
const sort = require('../util/sort');

const router = express.Router();

// ROUTES====================
router.get('/:folderId', bearerAuth, getFolder);
router.get('/f/:parentId', bearerAuth, getFolders);
router.get('/all/:type/:folderId', bearerAuth, getAllOtherFolders);
router.post('/', bearerAuth, addFolder);
router.patch('/:folderId', bearerAuth, updateFolder);
router.delete('/:folderId', bearerAuth, deleteFolder);

// HANDLERS==================
async function getFolder(req, res, next) {
  try {
    let { folderId } = req.params;
    let folder = await Folder.findOne({
      where: {
        id: folderId,
      },
    });
    if (!folder) {
      return res.status(404).json({ message: 'Content not found' });
    }
    if (folder.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.status(200).json(folder);
  } catch (err) {
    next(err);
  }
}

// Fetches all folders inside parent folder
async function getFolders(req, res, next) {
  try {
    let { parentId } = req.params;
    let uConfigs = await Config.findOne({ where: { userId: req.user.id } });
    let order = uConfigs ? sort(uConfigs.sort) : [['createdAt', 'DESC']];
    let query = {
      where: {
        userId: req.user.id,
        parentId: parentId === 'null' ? { [Op.is]: null } : parentId,
      },
      order: order,
    };
    let allFolders = await Folder.findAll(query);
    res.status(200).json(allFolders);
  } catch (err) {
    next(err);
  }
}

/**
 * Fetches all folders from user that are not the current folder and that do not
 * contain the current folder in the path (no children/inner folders)
 * If the root folder is given, sends all folders
 */
async function getAllOtherFolders(req, res, next) {
  try {
    let { type, folderId } = req.params;
    let folders;

    if (folderId !== 'null') {
      let exclude = type === 'folder' ? `{"id":%${folderId}` : null;
      folders = await db.query(
        `
        SELECT * FROM Folders
        WHERE userId = :userId
          AND id != :folderId
          AND path NOT LIKE :exclude
        `,
        {
          replacements: {
            userId: req.user.id,
            folderId: folderId,
            exclude: `%${exclude}%`,
          },
          type: db.QueryTypes.SELECT,
        },
      );
    } else {
      folders = await Folder.findAll({
        where: {
          userId: req.user.id,
        },
      });
    }
    res.status(200).json(folders);
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
    let folder = await Folder.findOne({ where: { userId: req.user.id, id: folderId } });
    if (!folder) {
      return res.status(404).json({ message: 'Content not found' });
    }
    let update = await folder.update(newUpdates);
    res.status(200).json(update);
  } catch (err) {
    next(err);
  }
}

async function deleteFolder(req, res, next) {
  try {
    let { folderId } = req.params;
    let folder = await Folder.destroy({
      where: {
        userId: req.user.id,
        [Op.or]: [
          { id: folderId },
          { parentId: folderId },
          { path: { [Op.like]: Sequelize.literal(`'%"id":${folderId}%'`) } },
        ],
      },
    });
    if (folder === 0) {
      return res.status(404).json({ message: 'Content Not Found' });
    }
    res.status(200).json({ message: 'Deleted Folder' });
  } catch (err) {
    next(err);
  }
}

module.exports = router;
