const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

// импортируем методы контроллера users
const {
  findUsers,
  findUserOne,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

// роутер чтения (получения информации)
router.get('/', findUsers);

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
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserProfile);

// роутер обновления аватара
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  }),
}), updateUserAvatar);

module.exports = router;
