// файл маршрутов карточек
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middleware/auth');
const validateURL = require('../middleware/methods');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

// авторизация
router.use(auth);

// роуты, требующие авторизации
router.get('/cards', getCards);

router.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().custom(validateURL, 'custom validation'),
    }),
  }),
  createCard,
);

router.delete(
  '/cards/:id',
  // валидация
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }),
  deleteCard,
);

router.put(
  '/cards/:id/likes',
  // валидация
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }),
  likeCard,
);

router.delete(
  '/cards/:id/likes',
  // валидация
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }),
  dislikeCard,
);

module.exports = router;
