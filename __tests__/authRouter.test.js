'use strict';

const { app } = require('../src/server');
const supertest = require('supertest');
const db = require('../src/jotter/db');
const { User } = require('../src/jotter/models');
const request = supertest(app);

let person = {
  email: 'cow@gmail.com',
  password: 'password123',
};

let person2 = {
  email: 'goat@gmail.com',
};

let user;

beforeAll(async () => {
  await db.sync();

  user = await User.create({
    email: 'bear',
    password: 'password123',
  });
});

afterAll(async () => {
  await db.drop();
});

describe('Signup', () => {
  test('/signup creates a new user and sends an object with the user and the token to the client.', async () => {
    let response = await request.post('/jotter/signup').send(person);

    expect(response.status).toEqual(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.id).toBeDefined();
    expect(response.body.email).toEqual(person.email);
  });

  test('/signup fails with no password', async () => {
    let response = await request.post('/jotter/signup').send(person2);

    expect(response.status).toEqual(500);
  });

  // test('/signup ', async () => {

  // });
});
