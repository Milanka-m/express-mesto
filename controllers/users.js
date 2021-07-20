const bcrypt = require('bcrypt');
// импортируем модель
const User = require('../models/user');

const opts = { runValidators: true, new: true };
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');

module.exports = {
  findUsers(req, res) {
    // ищем всех пользователей
    User.find({})
      .then((users) => res.send({ users }))
      .catch((err) => res.send({ err }));
  },

  findUser(req, res, next) {
    User.findById(req.user._id)
      .then((user) => {
        if (!user) {
          throw new NotFoundError('Пользователь по указанному _id не найден');
        }
        res.send({ user });
      })
      .catch(next);
  },

  findUserOne(req, res, next) {
    // ищем пользователя по id
    User.findById(req.params.id)
      .then((user) => {
        if (!user) {
          // если такого пользователя нет,
          // сгенерируем исключение
          throw new NotFoundError('Пользователь по указанному _id не найден');
        }

        res.send(user);
      })
      .catch(next);
  },

  // eslint-disable-next-line consistent-return
  async createUser(req, res, next) {
    try {
      const {
        email,
        password,
        name,
        about,
        avatar,
      } = req.body;

      // ищем пользователя по email
      const candidate = await User.findOne({ email });
      // если есть такой кандидат надо вернуть ошибку
      if (candidate) {
        throw new ConflictError('Пользователь с таким email уже существует на сервере');
      }

      // хешируем пароль
      const hashedPassword = bcrypt.hashSync(password, 9);

      // создадим пользователя с данными полями
      const user = new User({
        email,
        password: hashedPassword,
        name,
        about,
        avatar,
      });

      // дождемся пока юзер сохраниться
      await user.save();

      // если ответ успешный, на сервер отправиться объект user
      return res.send({
        message: 'Пользователь был успешно создан',
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        },
      });
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные в методы создания пользователя');
      }
      next(err);
    }
  },

  updateUserProfile(req, res, next) {
    const {
      name,
      about,
    } = req.body;
    User.findByIdAndUpdate(req.user._id, {
      name,
      about,
    }, opts)
      .then((user) => {
        res.send({ user });
      })
      // если ответ не успешный, отправим на сервер ошибку
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequestError('Переданы некорректные данные в методы создания пользователя');
        }
      })
      .catch(next);
  },

  updateUserAvatar(req, res, next) {
    const {
      avatar,
    } = req.body;

    User.findByIdAndUpdate(req.user._id, {
      avatar,
    }, opts)
      .then((user) => {
        res.send({ user });
      })
      // если ответ не успешный, отправим на сервер ошибку
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequestError('Переданы некорректные данные при обновлении аватара');
        }
      })
      .catch(next);
  },

};
