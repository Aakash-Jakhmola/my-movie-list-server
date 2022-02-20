const _errorHandler = {};

_errorHandler.throwError = ({ code = 500, message, req = {} }) => {
  const error = new Error(message);
  error.code = code;
  error.req = req;
  error.address = req.address;
  throw error;
};

module.exports = _errorHandler;
