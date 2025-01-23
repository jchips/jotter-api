'use strict';

const express = require('express');
const { Op } = require('sequelize');
const { Note, Config } = require('../models');
const bearerAuth = require('../auth/middleware/bearer');
const sort = require('../util/sort');

const router = express.Router();

// ROUTES====================
router.get('/:noteId', bearerAuth, getNote);
router.get('/', bearerAuth, getAllInRoot);
router.get('/f/:folderId', bearerAuth, getAllInFolder);
router.post('/', bearerAuth, addNote);
router.patch('/:noteId', bearerAuth, updateNote);
router.delete('/:noteId', bearerAuth, deleteNote);

// HANDLERS==================
async function getNote(req, res, next) {
  try {
    let { noteId } = req.params;
    let note = await Note.findOne({ where: { id: noteId } });
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
}
async function getAllInRoot(req, res, next) {
  try {
    let uConfigs = await Config.findOne({ where: { userId: req.user.id } });
    let order = sort(uConfigs.sort);
    let allNotesInRoot = await Note.findAll({
      where: {
        userId: req.user.id,
        folderId: { [Op.is]: null },
      },
      order: order,
    });
    res.status(200).json(allNotesInRoot);
  } catch (err) {
    next(err);
  }
}

async function getAllInFolder(req, res, next) {
  try {
    let { folderId } = req.params;
    let uConfigs = await Config.findOne({ where: { userId: req.user.id } });
    let order = sort(uConfigs.sort);
    let allNotesInFolder = await Note.findAll({
      where: {
        userId: req.user.id,
        folderId: folderId === 'null' ? { [Op.is]: null } : folderId,
      },
      order: order,
    });
    res.status(200).json(allNotesInFolder);
  } catch (err) {
    next(err);
  }
}

async function addNote(req, res, next) {
  try {
    let newNote = req.body;
    let add = await Note.create(newNote);
    res.status(201).json(add);
  } catch (err) {
    next(err);
  }
}

async function updateNote(req, res, next) {
  try {
    let { noteId } = req.params;
    let newUpdates = req.body;
    let note = await Note.findOne({ where: { id: noteId } });
    let update = await note.update(newUpdates);
    res.status(200).json(update);
  } catch (err) {
    next(err);
  }
}

async function deleteNote(req, res, next) {
  try {
    let { noteId } = req.params;
    await Note.destroy({ where: { id: noteId } });
    res.status(200).json({ message: 'deleted note' });
  } catch (err) {
    next(err);
  }
}

module.exports = router;
