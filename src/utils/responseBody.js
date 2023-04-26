/**
 * This object will be used as a template for building error responses
 */
const errorResponseBody = {
  error: {},
  message: 'Something went wrong, cannot process the request',
  success: false,
  data: {},
};

/**
 * This object will be used as a template for building success responses
 */
const successResponseBody = {
  data: {},
  message: 'Successfully processed the request',
  success: true,
  error: {},
};

export { successResponseBody, errorResponseBody };
