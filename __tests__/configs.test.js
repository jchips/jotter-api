'use strict';

const { app } = require('../src/server');
const supertest = require('supertest');
const db = require('../src/jotter/db');
const { User, Config } = require('../src/jotter/models');
const request = supertest(app);

let user1;
// let user2;

beforeAll(async () => {
  try {
    await db.sync();

    // Create users
    user1 = await User.create({
      email: 'user1@gmail.com',
      password: 'password123',
    });
    // user2 = await User.create({
    //   email: 'user2@gmail.com',
    //   password: 'password123',
    // });

    // Create user configuration
    await Config.create({
      userId: 1,
      theme: 'system',
    });
    // await Config.create({
    //   userId: 2,
    //   theme: 'system',
    // });
  } catch (err) {
    console.error('Error syncing database:', err);
    process.exit(1);
  }
});

afterAll(async () => {
  await db.drop();
});

describe('Configurations', () => {
  test('/getConfigs - Fetch all configurations for given user', async () => {
    let response = await request.get('/jotter/config').set('Authorization', `Bearer ${user1.token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(1);
    expect(response.body.theme).toEqual('system');
    expect(response.body.sort).toEqual('1');
    expect(response.body.hidePreview).toEqual(false);
  });

  test('/updateConfigs - Update a user configuration', async () => {
    await request.patch('/jotter/config')
      .set('Authorization', `Bearer ${user1.token}`)
      .send({ gridSize: '2' });
    let response = await request.get('/jotter/config').set('Authorization', `Bearer ${user1.token}`);

    expect(response.status).toBe(200);
    expect(response.body.gridSize).toEqual('2');
  });
});
