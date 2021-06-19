// импортируем модель
const Card = require('../models/card');

module.exports = {
  findCards(req, res) {
    // ищем все карточки
    Card.find({})
      .then((cards) => res.send({ cards }))
      .catch((err) => res.send({ err }));
  },

  createCard(req, res) {
    const owner = req.user._id;
    const {
      name,
      link,
    } = req.body;
    // создаем карточку
    Card.create({
      name,
      link,
      owner,
    })
      // если ответ успешный, на сервер отправиться объект card
      .then((card) => res.send({ card }))
      // если ответ не успешный, отправим на сервер ошибку
      .catch((err) => {
        // eslint-disable-next-line no-bitwise
        if (err.message && ~err.message.indexOf('validation failed')) {
          res.status(400).send({
            message: 'Переданы некорректные данные в методы создания карточки',
          });
        }
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      });
  },

  removeCard(req, res) {
    // параметром передадим только id
    Card.findByIdAndDelete(req.params.id)
      .then((card) => res.send({ card }))
      // если ответ не успешный, отправим ошибку
      .catch((err) => {
        // eslint-disable-next-line no-bitwise
        if (err.message && ~err.message.indexOf('Cast to ObjectId failed')) {
          res.status(404).send({
            message: 'Карточка с указанным _id не найдена',
          });
        }
      });
  },

  likeCard(req, res) {
    Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
      .then((card) => res.send({ card }))
      // если ответ не успешный, отправим ошибку
      .catch((err) => {
        // eslint-disable-next-line no-bitwise
        if (err.message && ~err.message.indexOf('Cast to ObjectId failed')) {
          res.status(400).send({
            message: 'Переданы некорректные данные для постановки лайка',
          });
        }
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      });
  },

  dislikeCard(req, res) {
    Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
      .then((card) => res.send({ card }))
      // если ответ не успешный, отправим на сервер ошибку
      .catch((err) => {
        // eslint-disable-next-line no-bitwise
        if (err.message && ~err.message.indexOf('Cast to ObjectId failed')) {
          res.status(400).send({
            message: 'Переданы некорректные данные для снятия лайка',
          });
        }
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      });
  },

};
