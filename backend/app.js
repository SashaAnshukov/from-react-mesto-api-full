require('dotenv').config(); // модуль для загрузки env-переменных в Node.js
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const userRoutes = require('./routes/users'); // импортируем роуты пользователя
const cardRoutes = require('./routes/cards'); // импортируем роуты карточек
const errorHandler = require('./middleware/error-handler');
// const cors = require('cors');
const { requestLogger, errorLogger } = require('./middleware/logger');
const NotFoundError = require('./errors/not-found-error');

const { PORT = 3006 } = process.env;

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(requestLogger);

// крашик
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

/* app.use(cors({
  origin = [
    'http://localhost:3000',
    'http://buenosdias.nomoredomains.work',
    'https://buenosdias.nomoredomains.work',
    'http://buenosdias.nomoredomains.work',
    'https://buenosdias2.nomoredomains.work',
    'http://praktikum.tk',
    'https://praktikum.tk'
  ], // домен фронтенда
  methods: [GET,HEAD,PUT,PATCH,POST,DELETE],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-type', 'origin'],
  credentials: true
})); */

// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'http://localhost:3006',
  'http://buenosdias.nomoredomains.work',
  'https://buenosdias.nomoredomains.work',
  'http://buenosdias.nomoredomains.work',
  'https://buenosdias2.nomoredomains.work',
];

// безопасность
app.use((req, res, next) => {
  // Сохраняем источник запроса в переменную origin и
  // проверяем, что источник запроса есть среди разрешённых
  const { origin } = req.headers;
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  const requestHeaders = req.headers['access-control-request-headers'];
  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // завершаем обработку запроса и возвращаем результат клиенту
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    res.end();
    return;
  }
  next();
});

app.use('/', userRoutes); // запускаем импортированные роуты
app.use('/', cardRoutes); // запускаем импортированные роуты

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler); // централизованный обработчик ошибок (500 )

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
