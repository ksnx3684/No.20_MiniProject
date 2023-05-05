errorHandler = async (err, req, res, next) => {
  const { statusCode, message, failedApi } = err;
  console.error(err);

  if (statusCode) {
    res.status(statusCode).json({ errorMessage: message });
  } else {
    res.status(400).json({ errorMessage: `${failedApi}에 실패했습니다.` });
  }
};

module.exports = errorHandler;
