const STATUS_CODES = {
  OK: 200,
  INTERNAL_SERVER_ERROR: 500,
  CREATED: 201,
  UNAUTHORISED: 401,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  UNPROCESSABLE_ENTITY: 422,
  GONE: 410,
  PAYMENT_REQUIRED: 402,
};

const COOKIE_NAMES = {
  AUTH: 'Bearer',
};

const NEWS_TOPICS = [
  'business',
  'entertainment',
  'general',
  'health',
  'science',
  'sports',
  'technology',
];

export { STATUS_CODES as STATUS, COOKIE_NAMES as COOKIE, NEWS_TOPICS };
