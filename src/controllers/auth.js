import jwt from 'jsonwebtoken';
import User from '.././models/user.js';
import { STATUS } from '../utils/constants.js';
import {
  successResponseBody,
  errorResponseBody,
} from '../utils/responseBody.js';
import { hashPassword } from '../utils/password.js';

const register = async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    const hashedPassword = await hashPassword(password);

    const user = User.write({ ...rest, password: hashedPassword });

    const token = jwt.sign(
      {
        _id: user.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    user.password = undefined;

    res.cookie('token', token, {
      httpOnly: true,
      // domain: '',
      secure: process.env.NODE_ENV !== 'development', // Only works on https
    });

    successResponseBody.data = user;
    successResponseBody.message = 'User registration successful.';
    return res.status(STATUS.CREATED).json(successResponseBody);
  } catch (error) {
    console.log(error);
    errorResponseBody.error = error.message;
    return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
  }
};

export { register };
