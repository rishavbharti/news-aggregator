import Database from '../db/index.js';
import { NEWS_TOPICS } from '../utils/constants.js';

const userSchema = {
  username: {
    type: 'String',
    trim: true,
    minLength: 3,
    maxLength: 100,
    required: true,
  },
  email: {
    type: 'String',
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email',
    ],
    lowercase: true,
    trim: true,
    minLength: 6,
    maxLength: 100,
    required: true,
  },
  password: {
    type: 'String',
    trim: true,
    minLength: 6,
    maxLength: 70,
    required: true,
  },
  preferences: {
    type: 'Array',
    default: [],
    values: NEWS_TOPICS,
  },
  read: {
    type: 'Array',
    default: [],
  },
  favorites: {
    type: 'Array',
    default: [],
  },
};

export default new Database().model('User', userSchema);
