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

  test('/getFolder - user cannot access another user\'s folder', async () => {
    let response = await request.get('/jotter/folder/1').set('Authorization', `Bearer ${user2.token}`);

    expect(response.status).toBe(403);
  });

  test('/addFolder - create a folder in root (home) folder', async () => {
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

  test('/addFolder - create a nested folder', async () => {
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

  test('/getAllOtherFolders - gets all folders that are not inner folders of specified folder and not the specified folder itself', async () => {
    let response = await request.get('/jotter/folder/all/folder/1').set('Authorization', `Bearer ${user1.token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(1);
    expect(response.body[0].title).toEqual('second-folder');
  });

  test('/updateFolder - update specified folder', async () => {
    await request.patch('/jotter/folder/2').set('Authorization', `Bearer ${user1.token}`).send({ title: 'new folder name' });
    let response = await request.get('/jotter/folder/2').set('Authorization', `Bearer ${user1.token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(2);
    expect(response.body.title).toEqual('new folder name');
  });

  test('/updateFolder - user cannot update another user\'s folder', async () => {
    let response = await request.patch('/jotter/folder/1').set('Authorization', `Bearer ${user2.token}`).send({ title: 'this folder has been edited' });

    expect(response.status).toBe(500);
  });

  test('/deleteFolder - delete specified folder', async () => {
    let response1 = await request.delete('/jotter/folder/1').set('Authorization', `Bearer ${user1.token}`);
    let response2 = await request.get('/jotter/folder/1').set('Authorization', `Bearer ${user1.token}`);

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(404);
    expect(response1.body.message).toEqual('Deleted Folder');
  });

  test('/deleteFolder - nested folders get deleted', async () => {
    let response = await request.get('/jotter/folder/3').set('Authorization', `Bearer ${user1.token}`);

    expect(response.status).toBe(404);
  });

  test('/deleteFolder - user cannot delete another user\'s folder', async () => {
    let response1 = await request.delete('/jotter/folder/2').set('Authorization', `Bearer ${user2.token}`);
    let response2 = await request.get('/jotter/folder/2').set('Authorization', `Bearer ${user1.token}`);

    expect(response1.status).toBe(404);
    expect(response2.body.title).toEqual('new folder name');
  });
});
