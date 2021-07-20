// импортируем модель
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorized-err');

const { NODE_ENV, JWT_SECRET } = process.env;
// функция, которая генерирует токен, принимает id пользователя
const generateAccessToken = (_id) => {
  const payload = { _id };
  return jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
    expiresIn: '7d',
  });
};

module.exports.login = (req, res, next) => {
  // получаем поля логин и пароль из тела запроса
  const { email, password } = req.body;

  // ищем пользователя по email
  User.findOne({ email }).select('+password')
    .then((user) => {
      // если не найден такой пользователь надо вернуть ошибку
      if (!user) {
        throw new UnauthorizedError('Такого пользователя не существует');
      }
      // проверяем пароль на корректность, передаем параметры (пароль и захешированный пароль)
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      // если пароль некорректен вернем ошибку
      if (!isPasswordCorrect) {
        throw new UnauthorizedError('Введенный логин или пароль некорректен');
      }

      // возвращаем jwt
      return res.send({
        token: generateAccessToken(user._id),
      });
    })
    .catch(next);
};
