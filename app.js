require('dotenv').config();
// подключаем express
const express = require('express');
// подключаем mongoose
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
// импортируем роутер users
const userRoutes = require('./routes/users');
// импортируем роутер cards
const cardRoutes = require('./routes/cards');
const { createUser } = require('./controllers/users');
const { login } = require('./controllers/login');
const authMiddlevare = require('./middlewares/auth');
const corsMiddlevare = require('./middlewares/cors');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/Logger');

// создаем приложение методом express
const app = express();
// создаем переменную окружения
const { PORT = 3000 } = process.env;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function start() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
}

app.use(requestLogger); // подключаем логгер запросов
app.use(corsMiddlevare);

// роуты, не требующие авторизации
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar:
    Joi.string()
      .pattern(/^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

// мидлвэра, которая по эндопоинту /users будет использовать роутер userRoutes
app.use('/users', authMiddlevare, userRoutes);

// мидлвэра, которая по эндопоинту /cards будет использовать роутер cardRoutes
app.use('/cards', authMiddlevare, cardRoutes);

// мидлвэра, которая отдает 404 ошибку при запросе несуществующего роута
app.use((req, res, next) => {
  next(new NotFoundError('Страница на которую вы попапли, не существует'));
});

app.use(errorLogger); // подключаем логгер ошибок

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// централизованная обработка ошибок
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const { message } = err;
  res.status(status).json({ message: message || 'Произошла ошибка на сервере' });
  return next();
});

// приложение будет слушаться на 3000 порту
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

// при каждом запуске приложения происходит подключение к mongoose
start();
