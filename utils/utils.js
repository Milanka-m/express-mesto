const orFailError = () => {
  const error = new Error('Запись/данные отсутвуют в базе');
  error.statusCode = 404;
  throw error;
};

module.exports = orFailError;
