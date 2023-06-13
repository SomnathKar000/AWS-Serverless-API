const buildResponse = (body) => {
  return {
    statusCode: 200,
    body: JSON.stringify(body),
  };
};

const customError = (statusCode, message, stack) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      Status: false,
      message: message,
      stack: stack ? stack : {},
    }),
  };
};

module.exports = { buildResponse, customError };
