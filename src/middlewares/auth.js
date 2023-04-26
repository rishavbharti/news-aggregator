import { STATUS } from '../utils/constants.js';
import { errorResponseBody } from '../utils/responseBody.js';

const validateRegisterRequest = async (req, res, next) => {
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

export { validateRegisterRequest };
