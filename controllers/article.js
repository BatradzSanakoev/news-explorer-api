/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
/* eslint-disable linebreak-style */
const Article = require('../models/article');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => {
      if (!articles) {
        throw new NotFoundError('Данные не найдены!');
      }
      res.send(articles);
    })
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  const owner = req.user._id;
  Article.create({ keyword, title, text, date, source, link, image, owner })
    .then((article) => {
      if (!article) {
        throw new BadRequestError('Переданы некорректные данные!');
      }
      res.send(article);
    })
    .catch((err) => {
      throw new BadRequestError(`Переданы некорректные данные! ${err}`);
    })
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findByIdAndRemove(req.params._id).select('+owner')
    .then((article) => {
      if (article.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалить чужую статью!');
      }
      if (!article) {
        throw new NotFoundError('Данные не найдены!');
      }
      res.send(article);
    })
    .catch(next);
};