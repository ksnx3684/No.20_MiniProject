errorWithCode = (statusCode, message, failedApi) => {
    let error = new Error(message);

    error.statusCode = statusCode;
    error.failedApi = failedApi;

    return error;
};

module.exports = errorWithCode;
