import axios from 'axios';
import { STATUS } from '../utils/constants.js';
import {
  successResponseBody,
  errorResponseBody,
} from '../utils/responseBody.js';

const API = axios.create({
  baseURL: 'http://eventregistry.org/api/v1',
  headers: { 'Content-Type': ' application/json' },
});

const fetchNewsFromAPI = async (topics) => {
  const res = await API.post('/article/getArticles', {
    action: 'getArticles',
    keyword: topics,
    keywordOper: 'or',
    lang: ['eng'],
    articlesPage: 1,
    articlesCount: 100,
    articlesSortBy: 'date',
    articlesSortByAsc: false,
    articlesArticleBodyLen: -1,
    resultType: 'articles',
    dataType: ['news', 'pr'],
    apiKey: process.env.API_KEY,
    forceMaxDataTimeWindow: 31,
  });

  return res.data;
};

const getNews = async (req, res) => {
  try {
    const { id: userId, preferences } = req.user || {};

    if (!userId) throw new Error();

    const data = await fetchNewsFromAPI(preferences);

    successResponseBody.data = data;
    successResponseBody.message = 'Success';
    res.status(STATUS.OK).json(successResponseBody);
  } catch (error) {
    console.log(error);
    errorResponseBody.error = error.message;
    res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
  }
};

export { getNews };
