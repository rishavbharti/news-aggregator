import User from '../../src/models/user.js';
import { hashPassword } from '../../src/utils/password.js';

const userOnePassword = await hashPassword('password');
const userTwoPassword = await hashPassword('123password');

const userOne = {
  username: 'John',
  email: 'john@example.com',
  password: userOnePassword,
};

const userTwo = {
  username: 'Snow',
  email: 'snow@example.com',
  password: userTwoPassword,
};

const setupDatabase = () => {
  User.deleteAll();
  const { userOneId } = User.write(userOne);
  const { userTwoId } = User.write(userTwo);

  return { userOneId, userTwoId };
};

export { userOne, userTwo, setupDatabase };
