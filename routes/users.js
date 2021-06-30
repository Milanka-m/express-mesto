const router = require('express').Router();

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
router.get('/:id', findUserOne);

// роутер обновления данных профиля
router.patch('/me', updateUserProfile);

// роутер обновления аватара
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
