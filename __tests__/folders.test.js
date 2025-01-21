'use strict';

const { app } = require('../src/server');
const supertest = require('supertest');
const db = require('../src/jotter/db');
const { User, Folder } = require('../src/jotter/models');
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

describe('Folders', () => {
  test('/getFolder - fetch specified folder', async () => {
    let response = await request.get('/jotter/folder/1').set('Authorization', `Bearer ${user1.token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(1);
    expect(response.body.title).toEqual('first-folder');
  });

  test('/folder - create a folder in root (home) folder', async () => {
    let newFolder = {
      title: 'second-folder',
      userId: 1,
      parentId: null,
      path: [],
    };
    let response = await request.post('/jotter/folder').set('Authorization', `Bearer ${user1.token}`).send(newFolder);

    expect(response.status).toBe(201);
    expect(response.body.title).toEqual('second-folder');
    expect(response.body.parentId).toBeNull();
  });

  test('/folder - create a nested folder', async () => {
    let newFolder = {
      title: 'nested-folder',
      userId: 1,
      parentId: 1,
      path: [{ id: 1, title: 'first-folder' }],
    };
    let response = await request.post('/jotter/folder').set('Authorization', `Bearer ${user1.token}`).send(newFolder);

    expect(response.status).toBe(201);
    expect(response.body.title).toEqual('nested-folder');
    expect(response.body.parentId).toEqual(1);
    expect(response.body.path).toEqual([{ id: 1, title: 'first-folder' }]);
  });

  test('/getFolders - gets all child folders of root (home) folder', async () => {
    let response = await request.get('/jotter/folder/f/null').set('Authorization', `Bearer ${user1.token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(2);
  });

  test('/getFolders - gets all child folders of specified folder', async () => {
    let response = await request.get('/jotter/folder/f/1').set('Authorization', `Bearer ${user1.token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(1);
    expect(response.body[0].title).toEqual('nested-folder');
    expect(response.body[0].parentId).toEqual(1);
    expect(response.body[0].path).toEqual([{ id: 1, title: 'first-folder' }]);
  });

  test('/getFolder - user cannot access another user\'s folder', async () => {
    let response = await request.get('/jotter/folder/1').set('Authorization', `Bearer ${user2.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeNull();
  });
});
