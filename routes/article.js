const articleRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const { getArticles, createArticle, deleteArticle } = require('../controllers/article');

articleRouter.get('/articles', getArticles);

articleRouter.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom((url) => {
      if (!validator.isURL(url)) {
        throw new Error('Неверно введенный URL');
      }
      return url;
    })
  })
}), createArticle);

articleRouter.delete('articles/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex()
  })
}), deleteArticle);