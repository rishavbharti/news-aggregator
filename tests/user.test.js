import request from 'supertest';
import app from '.././src/app.js';
import { setupDatabase } from './fixtures/db.js';
import { STATUS, COOKIE } from '../src/utils/constants.js';
import User from '../src/models/user.js';

let _userOneAuthToken, _userOneId;

beforeAll(() => {
  const { userOneId, userOneAuthToken } = setupDatabase();

  _userOneAuthToken = userOneAuthToken;
  _userOneId = userOneId;
});

test('Update news preferences', async () => {
  const response = await request(app)
    .put('/api/user/preferences')
    .set('Cookie', [`${COOKIE.AUTH}=${_userOneAuthToken}`])
    .send({
      preferences: ['business', 'general'],
    })
    .expect(STATUS.CREATED);

  // Assert that the database was changed correctly
  const { result: user } = User.findById(_userOneId);
  expect(user.preferences).toEqual(['entertainment', 'business', 'general']);

  expect(response.body).toMatchObject({
    data: ['entertainment', 'business', 'general'],
  });
});

test('Get news preferences', async () => {
  const response = await request(app)
    .get('/api/user/preferences')
    .set('Cookie', [`${COOKIE.AUTH}=${_userOneAuthToken}`])
    .expect(STATUS.OK);

  expect(response.body).toMatchObject({
    data: ['entertainment', 'business', 'general'],
  });
});
