import request from 'supertest';
import app from '.././src/app.js';
import { setupDatabase } from './fixtures/db.js';
import User from '../src/models/user.js';
import { STATUS } from '../src/utils/constants.js';

beforeAll(setupDatabase);

test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'Rishav Bharti',
      email: 'rishav@example.com',
      password: 'password',
    })
    .expect(STATUS.CREATED);

  // Assert that the database was changed correctly
  const { result: user } = User.findById(response.body.data.id);
  expect(user).not.toBeNull();

  // Assertions about the response
  expect(response.body).toMatchObject({
    data: {
      username: 'Rishav Bharti',
      email: 'rishav@example.com',
    },
  });
  expect(user.password).not.toBe('password');
});

test('Should not signup when email is missing', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'Rishav Bharti',
      password: 'password',
    })
    .expect(STATUS.BAD_REQUEST);

  expect(response.body.error).toBe('Email not present in the request!');
});

test('Should not signup with a registered email', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'Rishav Bharti',
      email: 'rishav@example.com',
      password: 'password',
    })
    .expect(STATUS.BAD_REQUEST);

  expect(response.body.error).toBe('email is already in use!');
});

test('Should login a valid user', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'rishav@example.com',
      password: 'password',
    })
    .expect(STATUS.OK);

  // Assert that the database was changed correctly
  const user = User.findById(response.body.data.id);
  expect(user).not.toBeNull();

  // Assertions about the response
  expect(response.body).toMatchObject({
    data: {
      username: 'Rishav Bharti',
      email: 'rishav@example.com',
    },
  });
  expect(user.password).not.toBe('password');
});

test('Should not login with unregistered email', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'rishav1@example.com',
      password: 'password',
    })
    .expect(STATUS.NOT_FOUND);

  expect(response.body.error).toBe(
    "Sorry, we don't recognize that username or password. You can try again or reset your password"
  );

  console.log('invalid user ', response.body);
});

test('Should not login when password is invalid', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'rishav@example.com',
      password: 'password123',
    })
    .expect(STATUS.NOT_FOUND);

  expect(response.body.error).toBe(
    "Sorry, we don't recognize that username or password. You can try again or reset your password"
  );
});
