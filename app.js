// подключаем express
const express = require('express');
// подключаем mongoose
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// импортируем роутер users
const userRoutes = require('./routes/users');
// импортируем роутер cards
const cardRoutes = require('./routes/cards');

// создаем приложение методом express
const app = express();
// создаем переменную окружения
const { PORT = 3000 } = process.env;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// мидлвэра добавляет в каждый запрос объект user
app.use((req, res, next) => {
  req.user = {
    _id: '60cb5817c38f8d36dced1113',
  };

  next();
});

// мидлвэра, которая по эндопоинту /users будет использовать роутер userRoutes
app.use('/users', userRoutes);

// мидлвэра, которая по эндопоинту /users будет использовать роутер cardRoutes
app.use('/cards', cardRoutes);

async function start() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
}

// приложение будет слушаться на 3000 порту
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

// при каждом запуске приложения происходит подключение к mongoose
start();
