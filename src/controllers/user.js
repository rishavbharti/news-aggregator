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
    const { id: userId, preferences: existingPreferences } = req.user || {};

    if (!preferences || !Array.isArray(preferences) || !preferences?.length)
      throw new Error('Preferences must be an array of strings.');

    preferences.forEach((preference) => {
      if (existingPreferences.includes(preference)) {
        throw new Error(`${preference} already exists!`);
      }
    });

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
