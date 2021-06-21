const orFailError = () => {
  const error = new Error('Карточка или пользователь по указанному _id не найден');
  error.statusCode = 404;
  throw error;
};

module.exports = orFailError;
