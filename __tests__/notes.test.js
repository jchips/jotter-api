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
    user1 = await User.create({
      email: 'user1@gmail.com',
      password: 'password123',
    });
    user2 = await User.create({
      email: 'user2@gmail.com',
      password: 'password123',
    });
    await Config.create({
      userId: 1,
      theme: 'system',
    });
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
  test('/getNote', async () => {
    let response = await request.get('/jotter/note/1').set('Authorization', `Bearer ${user1.token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(1);
    expect(response.body.title).toEqual('first-note');
    expect(response.body.content).toEqual('this is a note');
  });

  test('/addNote', async () => {
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

  test('/getAllInRoot', async () => {
    let response = await request.get('/jotter/note').set('Authorization', `Bearer ${user1.token}`);
    console.log('response:', response.body); // dl

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(2);
  });
});

