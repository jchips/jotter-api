'use strict';

const { app } = require('../src/server');
const supertest = require('supertest');
const db = require('../src/jotter/db');
const { User, Folder, Note, Config } = require('../src/jotter/models');
const request = supertest(app);

let user1;
let user2;

beforeAll(async () => {
  try {
    await db.sync();

    // Create users
    user1 = await User.create({
      email: 'user1@gmail.com',
      password: 'password123',
    });
    user2 = await User.create({
      email: 'user2@gmail.com',
      password: 'password123',
    });

    // Create user configuration
    await Config.create({
      userId: 1,
      theme: 'system',
    });

    // Create notes in root folder
    await Note.create({
      title: 'first-note',
      content: 'this is a note',
      userId: 1,
      folderId: null,
    });
    await Note.create({
      title: 'second-note',
      content: 'this is another note',
      userId: 1,
      folderId: null,
    });

    // Create folder
    await Folder.create({
      title: 'first-folder',
      userId: 1,
      parentId: null,
      path: [],
    });
  } catch (err) {
    console.error('Error syncing database:', err);
    process.exit(1);
  }
});

afterAll(async () => {
  await db.drop();
});

describe('Notes', () => {
  test('/getNote - fetch specified note', async () => {
    let response = await request.get('/jotter/note/1').set('Authorization', `Bearer ${user1.token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(1);
    expect(response.body.title).toEqual('first-note');
    expect(response.body.content).toEqual('this is a note');
  });

  test('/addNote - add a new note', async () => {
    let newNote = {
      title: 'new-note',
      content: 'lorem ipsum',
      userId: 1,
      folderId: 1,
    };
    let response = await request.post('/jotter/note').set('Authorization', `Bearer ${user1.token}`).send(newNote);

    expect(response.status).toBe(201);
    expect(response.body.id).toEqual(3);
  });

  test('/getAllInRoot - fetch all notes in the root folder', async () => {
    let response = await request.get('/jotter/note').set('Authorization', `Bearer ${user1.token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(2);
    expect(response.body[0].folderId).toBeNull();
    expect(response.body[1].folderId).toBeNull();
  });

  test('/getAllInFolder - fetch all notes in specified folder', async () => {
    let response = await request.get('/jotter/note/f/1').set('Authorization', `Bearer ${user1.token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(1);
    expect(response.body[0].folderId).toEqual(1);
    expect(response.body[0].title).toEqual('new-note');
  });

  test('/getNote - user cannot access another user\'s note', async () => {
    let response = await request.get('/jotter/note/1').set('Authorization', `Bearer ${user2.token}`);

    expect(response.status).toBe(403);
  });

  test('/updateNote - update specified note', async () => {
    await request.patch('/jotter/note/1')
      .set('Authorization', `Bearer ${user1.token}`)
      .send({ content: 'this note has been edited' });
    let response = await request.get('/jotter/note/1').set('Authorization', `Bearer ${user1.token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(1);
    expect(response.body.title).toEqual('first-note');
    expect(response.body.content).toEqual('this note has been edited');
  });

  test('/updateNote - user cannot update another user\'s note', async () => {
    let response = await request.patch('/jotter/note/1')
      .set('Authorization', `Bearer ${user2.token}`)
      .send({ content: 'this note has been edited' });

    expect(response.status).toBe(500);
  });

  test('/deleteNote - delete specified note', async () => {
    let response1 = await request.delete('/jotter/note/2').set('Authorization', `Bearer ${user1.token}`);
    let response2 = await request.get('/jotter/note/2').set('Authorization', `Bearer ${user1.token}`);

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(404);
    expect(response1.body.message).toEqual('Deleted Note');
  });

  test('/deleteNote - user cannot delete another user\'s note', async () => {
    let response1 = await request.delete('/jotter/note/1').set('Authorization', `Bearer ${user2.token}`);
    let response2 = await request.get('/jotter/note/1').set('Authorization', `Bearer ${user1.token}`);

    expect(response1.status).toBe(404);
    expect(response2.body.title).toEqual('first-note');
  });
});
