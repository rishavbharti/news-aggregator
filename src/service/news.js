import axios from 'axios';
import { NEWS_TOPICS } from '../utils/constants.js';

const newsCache = {};

const fetchNewsFromAPI = () => {
  const API = axios.create({
    baseURL: 'http://eventregistry.org/api/v1',
    headers: { 'Content-Type': ' application/json' },
  });

  console.log('here');

  axios
    .all(
      NEWS_TOPICS.map((topic) =>
        API.post('/article/getArticles', {
          action: 'getArticles',
          keyword: [topic],
          keywordOper: 'or',
          lang: ['eng'],
          articlesPage: 1,
          articlesCount: 50,
          articlesSortBy: 'date',
          articlesSortByAsc: false,
          articlesArticleBodyLen: -1,
          resultType: 'articles',
          dataType: ['news', 'pr'],
          apiKey: process.env.NEWSAPIAI_KEY,
          forceMaxDataTimeWindow: 31,
        })
      )
    )
    .then((response) => {
      NEWS_TOPICS.map(
        (topic, index) =>
          (newsCache[topic] = response[index]?.data?.articles?.results)
      );

      // Update cache after 2 hours
      setTimeout(fetchNewsFromAPI, 7200000); // 7200000 ms = 2 hours
    })
    .catch((err) => console.log(err));
};

export { newsCache, fetchNewsFromAPI };
