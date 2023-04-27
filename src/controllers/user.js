import User from '.././models/user.js';
import { STATUS } from '../utils/constants.js';
import {
  successResponseBody,
  errorResponseBody,
} from '../utils/responseBody.js';

const getPreferences = (req, res) => {
  try {
    const { id: userId } = req.user || {};

    if (!userId) throw new Error();

    const { result } = User.findById(userId);

    successResponseBody.data = result.preferences;
    successResponseBody.message = 'Success';
    res.status(STATUS.OK).json(successResponseBody);
  } catch (error) {
    console.log(error);
    errorResponseBody.error = error.message;
    res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
  }
};

const updatePreferences = (req, res) => {
  try {
    const { preferences } = req.body;
    const { id: userId } = req.user || {};

    if (!userId || !preferences || !Array.isArray(preferences))
      throw new Error();

    const { result } = User.findByIdAndUpdate(userId, { preferences });

    successResponseBody.data = result.preferences;
    successResponseBody.message = 'Updated.';
    res.status(STATUS.CREATED).json(successResponseBody);
  } catch (error) {
    console.log(error);
    errorResponseBody.error = error.message;
    res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
  }
};

export { getPreferences, updatePreferences };
