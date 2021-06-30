const bcrypt = require('bcrypt');
// импортируем модель
const User = require('../models/user');

const orFailError = require('../utils/utils');

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

  findUserOne(req, res, next) {
    // ищем пользователя по id
    User.findById(req.params.id).orFail(orFailError)
      .then((user) => {
        if (!user) {
          // если такого пользователя нет,
          // сгенерируем исключение
          throw new NotFoundError('Пользователь по указанному _id не найден');
        }

        res.send({ user });
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
        throw new ConflictError('Пользователь с таким email уже существует');
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

      if (!user) {
        throw new BadRequestError('Переданы некорректные данные в методы создания пользователя');
      }
      // дождемся пока юзер сохраниться
      await user.save();

      // если ответ успешный, на сервер отправиться объект user
      return res.send({
        message: 'Пользователь был успешно создан',
        user,
      });
    } catch (err) {
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
    }, opts).orFail(orFailError)
      .then((user) => {
        if (!user) {
          throw new BadRequestError('Переданы некорректные данные в методы создания пользователя');
        }
        res.send({ user });
      })
      // если ответ не успешный, отправим на сервер ошибку
      .catch(next);
  },

  updateUserAvatar(req, res, next) {
    const {
      avatar,
    } = req.body;

    User.findByIdAndUpdate(req.user._id, {
      avatar,
    }, opts).orFail(orFailError)
      .then((user) => {
        if (!user) {
          throw new BadRequestError('Переданы некорректные данные при обновлении аватара');
        }
        res.send({ user });
      })
      // если ответ не успешный, отправим на сервер ошибку
      .catch(next);
  },

};
