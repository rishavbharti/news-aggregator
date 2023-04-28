import { newsCache } from '../service/news.js';
import { NEWS_TOPICS, STATUS } from '../utils/constants.js';
import {
  successResponseBody,
  errorResponseBody,
} from '../utils/responseBody.js';

const getNews = (req, res) => {
  try {
    const { id: userId, preferences } = req.user || {};

    if (!userId) throw new Error();

    const _preferences = preferences.length ? preferences : NEWS_TOPICS;

    const news = {};

    _preferences.map(
      (preference) =>
        (news[preference] = newsCache?.[preference]?.slice(0, 10) || [])
    );

    successResponseBody.data = news;
    successResponseBody.message = 'Success';
    res.status(STATUS.OK).json(successResponseBody);
  } catch (error) {
    console.log(error);
    errorResponseBody.error = error.message;
    res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
  }
};

export { getNews };
