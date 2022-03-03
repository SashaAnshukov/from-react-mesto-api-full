// файл контроллеров карточек.
const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

// возвращает все карточки
module.exports.getCards = (request, response, next) => Card.find({})
  .then((cards) => response.status(200).send({ data: cards }))
  .catch(next);

// удаляет карточку по _id
module.exports.deleteCard = (request, response, next) => {
  const { id } = request.params;
  // console.log(request.params);
  // console.log(request.user._id);
  Card.findById(id)
    .orFail(() => new NotFoundError(`Карточка с id ${id} не найдена`))
    .then((card) => {
      if (!card.owner.equals(request.user._id)) {
        return next(new ForbiddenError('Недостаточно прав для удаления этой карточки'));
      }
      return card.remove()
        .then(() => response.send({ message: 'Карточка удалена' }));
    })
    .catch(next);
};

// создаёт карточку
module.exports.createCard = (request, response, next) => {
  const { name, link } = request.body; // получим из объекта запроса название и ссылку карточки
  const owner = request.user._id;
  return Card.create({ name, link, owner }) // создадим карточку на основе пришедших данных
    .then((card) => response.status(201).send(card)) // вернём записанные в базу данные
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(error.errors).map((err) => err.message).join(', ')}`));
      } else {
        next(error); // Для всех остальных ошибок
      }
    });
};

module.exports.likeCard = (request, response, next) => {
  Card.findByIdAndUpdate(
    request.params.id,
    { $addToSet: { likes: request.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Запрашиваемый пользователь с id ${request.params.id} не найден`);
      }
      return response.status(201).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError(`Переданный id ${request.params.id} не корректен`));
      } else {
        next(error); // Для всех остальных ошибок
      }
    });
};

module.exports.dislikeCard = (request, response, next) => {
  Card.findByIdAndUpdate(
  // console.log(request.user._id),
    request.params.id,
    { $pull: { likes: request.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Запрашиваемый пользователь с id ${request.params.id} не найден`);
      }
      return response.status(201).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError(`Переданный id ${request.params.id} не корректен`));
      } else {
        next(error); // Для всех остальных ошибок
      }
    });
};
