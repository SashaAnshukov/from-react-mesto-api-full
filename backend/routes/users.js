// файл маршрутов пользователя
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middleware/auth');
const validateURL = require('../middleware/methods');

const {
  getUsers, login, createUser, getUser, getUserId, updateUser, updateAvatar, signout,
} = require('../controllers/users');

// роуты, не требующие авторизации, регистрация и логин
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().required().custom(validateURL, 'custom validation'),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.get('/signout', signout);

// авторизация
router.use(auth);

// роуты, требующие авторизации
router.get('/users', getUsers);

router.get('/users/me', getUser);

router.get(
  '/users/:id',
  // валидация
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }),
  getUserId,
);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser,
);
router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(validateURL, 'custom validation'),
    }),
  }),
  updateAvatar,
);

// router.post('/users', createUser);
// router.get('/secured', secured);
module.exports = router;
