import { STATUS } from '../utils/constants.js';
import { errorResponseBody } from '../utils/responseBody.js';

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

export { validateRegisterRequest, validateLoginRequest };
