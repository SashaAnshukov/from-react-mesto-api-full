const express = require('express');

const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const userRoutes = require('./routes/users'); // импортируем роуты пользователя
const cardRoutes = require('./routes/cards'); // импортируем роуты карточек
const errorHandler = require('./middleware/error-handler');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middleware/logger');
const NotFoundError = require('./errors/not-found-error');

const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'localhost:3000',
  'http://buenosdias.nomoredomains.work',
  'https://buenosdias.nomoredomains.work',
  'http://praktikum.tk',
  'https://praktikum.tk'
];

// безопасность
app.use((req, res, next) => {
  const { origin } = req.headers;// Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  const { method } = req;
  const requestHeaders = req.headers["access-control-request-headers"];
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";

  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header("Access-Control-Allow-Origin", origin);
  }

  if (method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);
    res.header("Access-Control-Allow-Headers", requestHeaders);
    return res.end();
  }

  return next();
});

app.use(requestLogger);

//крашик
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', userRoutes); // запускаем импортированные роуты
app.use('/', cardRoutes); // запускаем импортированные роуты

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use(cors({
  origin: 'http://buenosdias.nomoredomains.work', // домен фронтенда
  credentials: true // для того, чтобы CORS поддерживал кроссдоменные куки
}));
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler); // централизованный обработчик ошибок (500 )

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
