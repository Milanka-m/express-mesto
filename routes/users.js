const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

// импортируем методы контроллера users
const {
  findUsers,
  findUser,
  findUserOne,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

// роутер чтения (получения информации)
router.get('/', findUsers);

// роутер возвращает профильные данные
router.get('/me', findUser);

// роутер чтения (получения) информации по id
router.get('/:id', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
}), findUserOne);

// роутер обновления данных профиля
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserProfile);

// роутер обновления аватара
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar:
    Joi.string()
      .required()
      .pattern(/^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
  }),
}), updateUserAvatar);

module.exports = router;
