// импортируем модель
const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports = {
  findCards(req, res) {
    // ищем все карточки
    Card.find({})
      .then((cards) => res.send(cards))
      .catch((err) => res.send({ err }));
  },

  createCard(req, res, next) {
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
      .then((card) => {
        if (!card) {
          throw new BadRequestError('Переданы некорректные данные в методы создания карточки');
        }
        res.send({ card });
      })
      // если ответ не успешный, отправим на сервер ошибку
      .catch(next);
  },

  removeCard(req, res, next) {
    // параметром передадим только id
    Card.findById(req.params.id)
      .then((card) => {
        if (!card) {
          throw new NotFoundError('Карточка по указанному _id не найденa');
        }
        if (String(card.owner) !== req.user._id) {
          throw new ForbiddenError('Недостаточно прав для удаления карточки');
        }
        Card.deleteOne({ _id: card._id })
          .then(() => {
            res.send({ card });
          })
          .catch(next);
      })

      .catch(next);
  },

  likeCard(req, res, next) {
    Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
      .then((card) => {
        if (!card) {
          throw new NotFoundError('Карточка с указанным _id не найдена');
        }
        res.send(card);
      })
      // если ответ не успешный, отправим ошибку
      .catch((err) => {
        if (err.name === 'CastError') {
          throw new BadRequestError('Переданы некорректные данные для постановки лайка');
        }
        next(err);
      })
      .catch(next);
  },

  dislikeCard(req, res, next) {
    Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
      .then((card) => {
        if (!card) {
          throw new NotFoundError('Карточка с указанным _id не найдена');
        }
        res.send(card);
      })
      // если ответ не успешный, отправим ошибку
      .catch((err) => {
        if (err.name === 'CastError') {
          throw new BadRequestError('Переданы некорректные данные для снятия лайка');
        }
        next(err);
      })
      .catch(next);
  },

};
