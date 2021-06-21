// импортируем модель
const User = require('../models/user');

const orFailError = require('../utils/utils');

const opts = { runValidators: true, new: true };
module.exports = {
  findUsers(req, res) {
    // ищем всех пользователей
    User.find({})
      .then((users) => res.send({ users }))
      .catch((err) => res.send({ err }));
  },

  findUserOne(req, res) {
    // ищем пользователя по id
    User.findById(req.params.id).orFail(orFailError)
      .then((users) => res.send({ users }))
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(404).send({
            message: 'Пользователь по указанному _id не найден',
          });
        }
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      });
  },

  createUser(req, res) {
    const {
      name,
      about,
      avatar,
    } = req.body;
    // создаем пользователя
    User.create({
      name,
      about,
      avatar,
    })
      // если ответ успешный, на сервер отправиться объект user
      .then((user) => res.send({ user }))
      // если ответ не успешный, отправим на сервер ошибку
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({
            message: 'Переданы некорректные данные в методы создания пользователя',
          });
        }
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      });
  },

  updateUserProfile(req, res) {
    const {
      name,
      about,
    } = req.body;
    User.findByIdAndUpdate(req.user._id, {
      name,
      about,
    }, opts).orFail(orFailError)
      .then((user) => res.send({ user }))
      // если ответ не успешный, отправим на сервер ошибку
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({
            message: 'Переданы некорректные данные при обновлении профиля',
          });
        }
        if (err.name === 'CastError') {
          res.status(404).send({
            message: 'Пользователь по указанному _id не найден',
          });
        }
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      });
  },

  updateUserAvatar(req, res) {
    const {
      avatar,
    } = req.body;

    User.findByIdAndUpdate(req.user._id, {
      avatar,
    }, opts).orFail(orFailError)
      .then((user) => res.send({ user }))
      // если ответ не успешный, отправим на сервер ошибку
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({
            message: 'Переданы некорректные данные при обновлении аватара',
          });
        }
        if (err.name === 'CastError') {
          res.status(404).send({
            message: 'Пользователь по указанному _id не найден',
          });
        }
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      });
  },

};
