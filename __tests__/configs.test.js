'use strict';

const { app } = require('../src/server');
const supertest = require('supertest');
const db = require('../src/jotter/db');
const { User, Config } = require('../src/jotter/models');
const request = supertest(app);

let user1;
let config;

beforeAll(async () => {
  try {
    await db.sync();
    user1 = await User.create({
      email: 'user1@gmail.com',
      password: 'password123',
    });
    config = await Config.create({ userId: 1 });
  } catch (err) {
    console.error('Error syncing database:', err);
    process.exit(1);
  }
});

afterAll(async () => {
  await db.drop();
});

describe('Configurations', () => {
  test('/getConfigs - fetch all configurations for given user', async () => {
    let response = await request.get('/jotter/config').set('Authorization', `Bearer ${user1.token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(1);
    expect(response.body.theme).toEqual('system');
    expect(response.body.sort).toEqual('1');
    expect(response.body.hidePreview).toEqual(false);
  });

  test('/getConfigs - error handling', async () => {
    jest.spyOn(Config, 'findOne').mockRejectedValue(new Error('Database error'));
    let response = await request.get('/jotter/config').set('Authorization', `Bearer ${user1.token}`);
    Config.findOne.mockRestore();

    expect(response.status).toBe(500);
  });

  test('/updateConfigs - update a user configuration', async () => {
    await request.patch('/jotter/config')
      .set('Authorization', `Bearer ${user1.token}`)
      .send({ gridSize: '2' });
    let response = await request.get('/jotter/config').set('Authorization', `Bearer ${user1.token}`);

    expect(response.status).toBe(200);
    expect(response.body.gridSize).toEqual('2');
  });

  test('/updateConfigs - error handling', async () => {
    jest.spyOn(Config, 'findOne').mockRejectedValue(new Error('Database error'));
    let updateRes = await request.patch('/jotter/config')
      .set('Authorization', `Bearer ${user1.token}`)
      .send({ highlightActiveLine: false });
    Config.findOne.mockRestore();

    expect(updateRes.status).toBe(500);
    expect(config.highlightActiveLine).toEqual(true);
  });
});
