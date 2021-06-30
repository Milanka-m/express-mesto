// импортируем модель
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// функция, которая генерирует токен, принимает id пользователя и роль
const generateAccessToken = (_id) => {
  const payload = { _id };
  return jwt.sign(payload, 'secret', {
    expiresIn: '7d',
  });
};

module.exports.login = (req, res) => {
  // получаем поля логин и пароль из тела запроса
  const { email, password } = req.body;

  // ищем пользователя по email
  User.findOne({ email }).select('+password')
    .then((user) => {
      // если не найден такой пользователь надо вернуть ошибку
      if (!user) {
        return res.status(400).send({
          message: 'Такого пользователя не существует',
        });
      }
      // проверяем пароль на корректность, передаем параметры (пароль и захешированный пароль)
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      // если пароль некорректен вернем ошибку
      if (!isPasswordCorrect) {
        return res.status(400).send({
          message: 'Введенный логин или пароль некорректен',
        });
      }

      // возвращаем jwt
      return res.send({
        token: generateAccessToken(user._id),
      });
    })
    .catch((err) => {
      res.status(400).send({ err });
    });
};
