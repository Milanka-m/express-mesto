// импортируем модель
const User = require('../models/user');

module.exports = {
  findUsers(req, res) {
    // ищем всех пользователей
    User.find({})
      .then((users) => res.send({ users }))
      .catch((err) => res.send({ err }));
  },

  findUserOne(req, res) {
    // eslint-disable-next-line no-console
    console.log(req.params.id);
    // ищем пользователя по id
    User.findById(req.params.id)
      .then((users) => res.send({ users }))
      .catch((err) => {
        // eslint-disable-next-line no-bitwise
        if (err.message && ~err.message.indexOf('Cast to ObjectId failed')) {
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
        // eslint-disable-next-line no-bitwise
        if (err.message && ~err.message.indexOf('validation failed')) {
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
    })
      .then((user) => res.send({ user }))
      // если ответ не успешный, отправим на сервер ошибку
      .catch((err) => {
        // eslint-disable-next-line no-bitwise
        if (err.message && ~err.message.indexOf('validation failed')) {
          res.status(400).send({
            message: 'Переданы некорректные данные при обновлении профиля',
          });
        }
        // eslint-disable-next-line no-bitwise
        if (err.message && ~err.message.indexOf('Cast to ObjectId failed')) {
          res.status(404).send({
            message: 'Пользователь с указанным _id не найден',
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
    })
      .then((user) => res.send({ user }))
      // если ответ не успешный, отправим на сервер ошибку
      .catch((err) => {
        // eslint-disable-next-line no-bitwise
        if (err.message && ~err.message.indexOf('validation failed')) {
          res.status(400).send({
            message: 'Переданы некорректные данные при обновлении аватара',
          });
        }
        // eslint-disable-next-line no-bitwise
        if (err.message && ~err.message.indexOf('Cast to ObjectId failed')) {
          res.status(404).send({
            message: 'Пользователь с указанным _id не найден',
          });
        }
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      });
  },

};
