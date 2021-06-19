const router = require('express').Router();

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
router.post('/', createCard);

// роутер удаления карточки по id
router.delete('/:id', removeCard);

// роутер лайка карточки
router.put('/:id/likes', likeCard);

// роутер дизлайка карточки
router.delete('/:id/likes', dislikeCard);

module.exports = router;
