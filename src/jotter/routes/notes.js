'use strict';

const express = require('express');
const { Note } = require('../models');
const bearerAuth = require('../auth/middleware/bearer');

const router = express.Router();

// ROUTES====================
router.get('/:folderId', bearerAuth, getAllInFolder);
router.post('/', bearerAuth, addNote);
router.patch('/:noteId', bearerAuth, updateNote);
router.delete('/:noteId', bearerAuth, deleteNote);

// HANDLERS==================
async function getAllInFolder(req, res, next) {
  try {
    let { folderId } = req.params;
    let allFilesInFolder = await Note.findAll({
      where: {
        userId: req.user.id,
        folderId,
      },
    });
    res.status(200).json(allFilesInFolder);
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
