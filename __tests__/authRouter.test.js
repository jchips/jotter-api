'use strict';

const { app } = require('../src/server');
const supertest = require('supertest');
const db = require('../src/jotter/db');
const request = supertest(app);

let person = {
  email: 'cow@gmail.com',
  password: 'password123',
};

let person2 = {
  email: 'goat@gmail.com',
};

beforeAll(async () => {
  await db.sync();
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
    expect(response.body.password).toBeDefined();
  });

  test('/signup fails with no password', async () => {
    let response = await request.post('/jotter/signup').send(person2);

    expect(response.status).toEqual(500);
  });
});

describe('Login', () => {
  test('/signin with basic authentication headers logs in a user and sends an object with the user and the token to the client', async () => {
    let response = await request.post('/jotter/login').auth(person.email, person.password);

    expect(response.status).toEqual(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.id).toBeDefined();
    expect(response.body.user.email).toEqual(person.email);
  });

  test('basic auth fails with unknown user', async () => {
    const response = await request.post('/jotter/login').auth('test', 'banana');

    expect(response.status).toBe(403);
    expect(response.text).toEqual('Invalid login');
    expect(response.body.user).not.toBeDefined();
    expect(response.body.token).not.toBeDefined();
  });
});

describe('Check auth', () => {
  test('check for cookie', async () => {
    const loginRes = await request.post('/jotter/login').auth(person.email, person.password);
    const response = await request.get('/jotter').set('Authorization', `Bearer ${loginRes.body.token}`);

    expect(response.status).toBe(200);
    expect(response.headers['set-cookie'][0]).toContain(`jwt=${response.body.token}`);
  });
  test('log user out (clear cookie)', async () => {
    let response = await request.post('/jotter/logout');

    expect(response.status).toBe(200);
    expect(response.headers['set-cookie']).toEqual(['jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT']);
  });
});
