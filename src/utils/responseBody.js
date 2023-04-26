/**
 * This object will be used as a template for building error responses
 */
const errorResponseBody = {
  error: {},
  data: {},
  message: 'Something went wrong, cannot process the request',
  success: false,
};

/**
 * This object will be used as a template for building success responses
 */
const successResponseBody = {
  error: {},
  data: {},
  message: 'Successfully processed the request',
  success: true,
};

export { successResponseBody, errorResponseBody };
