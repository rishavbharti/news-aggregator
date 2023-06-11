import request from 'supertest';
import app from '.././src/app.js';
import { setupDatabase } from './fixtures/db.js';
import { STATUS, COOKIE, NEWS_TOPICS } from '../src/utils/constants.js';
import User from '../src/models/user.js';

let _userOneAuthToken, _userOneId;

beforeAll(() => {
  const { userOneId, userOneAuthToken } = setupDatabase();

  _userOneAuthToken = userOneAuthToken;
  _userOneId = userOneId;
});

test('Get news', async () => {
  const response = await request(app)
    .get('/api/news')
    .set('Cookie', [`${COOKIE.AUTH}=${_userOneAuthToken}`])
    .expect(STATUS.OK);

  const {
    result: { preferences },
  } = User.findById(_userOneId);

  const _preferences = preferences.length ? preferences : NEWS_TOPICS;
  expect(Object.keys(response.body.data)).toEqual(_preferences);
});
