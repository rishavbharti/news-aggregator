import User from '.././models/user.js';
import { STATUS } from '../utils/constants.js';
import {
  successResponseBody,
  errorResponseBody,
} from '../utils/responseBody.js';

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

export { updatePreferences };
