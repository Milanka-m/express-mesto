// подключаем express
const express = require('express');
// подключаем mongoose
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// импортируем роутер users
const userRoutes = require('./routes/users');
// импортируем роутер cards
const cardRoutes = require('./routes/cards');
const { createUser } = require('./controllers/users');
const { login } = require('./controllers/login');
const authMiddlevare = require('./middlewares/auth');

// создаем приложение методом express
const app = express();
// создаем переменную окружения
const { PORT = 3000 } = process.env;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// роуты, не требующие авторизации
app.post('/signup', createUser);
app.post('/signin', login);

/* // защитим роуты авторизацией
app.use(authMiddlevare); */

// мидлвэра, которая по эндопоинту /users будет использовать роутер userRoutes
app.use('/users', authMiddlevare, userRoutes);

// мидлвэра, которая по эндопоинту /users будет использовать роутер cardRoutes
app.use('/cards', authMiddlevare, cardRoutes);

// мидлвэра, которая отдает 404 ошибку при запросе несуществующего роута
app.use((req, res) => {
  res.status(404).send({ message: 'Страница на которую вы попапли, не существует' });
});

async function start() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
}

/* // централизованная обработка ошибок
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
}); */

// приложение будет слушаться на 3000 порту
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

// при каждом запуске приложения происходит подключение к mongoose
start();
