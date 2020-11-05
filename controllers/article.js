/* eslint-disable no-underscore-dangle */
/* eslint-disable linebreak-style */
const Article = require('../models/article');

module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => {
      if (!articles) {
        throw new Error('Данные не найдены!');
      }
      res.send(articles);
    })
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  Article.create({ keyword, title, text, date, source, link, image })
    .then((article) => {
      if (!article) {
        throw new Error('Переданы некорректные данные!');
      }
      res.send(article);
    })
    .catch((err) => {
      throw new Error(`Переданы некорректные данные! ${err}`);
    })
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findByIdAndRemove(req.params._id).select('+owner')
    .then((article) => {
      if (article.owner.toString() !== req.user._id) {
        throw new Error('Вы не можете удалить чужую статью!');
      }
      if (!article) {
        throw new Error('Данные не найдены!');
      }
      res.send(article);
    })
    .catch(next);
};