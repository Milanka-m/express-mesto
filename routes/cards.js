const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

// импортируем методы контроллера cards
const {
  findCards,
  createCard,
  removeCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// роутер чтения (получения информации) о всех карточках
router.get('/', findCards);

// роутер записи (создания объекта) карточки
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link:
    Joi.string()
      .required()
      .pattern(/^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
  }),
}), createCard);

// роутер удаления карточки по id
router.delete('/:id', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
}), removeCard);

// роутер лайка карточки
router.put('/:id/likes', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
}), likeCard);

// роутер дизлайка карточки
router.delete('/:id/likes', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
}), dislikeCard);

module.exports = router;
