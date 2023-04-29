import jwt from 'jsonwebtoken';
import { COOKIE, STATUS } from '../utils/constants.js';
import { errorResponseBody } from '../utils/responseBody.js';
import User from '../models/user.js';
import { getCookie } from '../utils/cookie.js';

const validateRegisterRequest = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    const missingField =
      (!username && 'Username') ||
      (!email && 'Email') ||
      (!password && 'Password');

    errorResponseBody.error = `${missingField} not present in the request!`;

    return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
  }

  // If the request is valid
  next();
};

const validateLoginRequest = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const missingField = (!email && 'Email') || (!password && 'Password');

    errorResponseBody.error = `${missingField} not present in the request!`;

    return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
  }

  // If the request is valid
  next();
};

const authenticate = (req, res, next) => {
  const cookie = getCookie(req, COOKIE.AUTH);

  if (cookie) {
    try {
      jwt.verify(cookie, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          // If the cookie is invalid or has expired
          throw new Error();
        } else {
          // If the cookie is valid and has not expired
          if (!decoded.hasOwnProperty('id')) throw new Error();

          const { result: user } = User.findById(decoded?.id);

          if (!user) throw new Error('Invalid user');

          req.user = user;
          next();
        }
      });
    } catch (error) {
      console.log(error);
      errorResponseBody.error = error?.message || 'Invalid auth token.';
      res.status(STATUS.UNAUTHORISED).json(errorResponseBody);
    }
  } else {
    errorResponseBody.error = 'Missing auth token.';
    res.status(STATUS.UNAUTHORISED).json(errorResponseBody);
  }
};

export { validateRegisterRequest, validateLoginRequest, authenticate };
