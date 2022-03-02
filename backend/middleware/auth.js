// мидлвэр для авторизации
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

const auth = (req, res, next) => {
  const {authorization} = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    //res.status(401).send({message: 'Прошляпил авторизацию'})
    next(new UnauthorizedError('Прошляпил авторизацию'))
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация ёпт'));
  }

  req.user = payload;

  return next();
};

/*const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  // const token = req.headers.cookie;
  // console.log(req.headers.cookie);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация ёпт'));
  }

  req.user = payload;

  next();
};*/

module.exports = auth;
