const Article = require('../models/article');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');
const BadReq = require('../errors/BadReq');

const getAllArticles = (req, res, next) => {
  const owner = req.user._id;
  Article.find({owner})
    .then((article) => {
      // console.log('getAllArticles on Articles controller');
      // console.log(Articles);
      res.status(200).send(article);
    })
    .catch((err) => { next(err); });
};

const createArticle = (req, res, next) => {
  // console.log('here');
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const id = req.user._id;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: id,
  })
    .then((article) => {
      // console.log(Article);
      // console.log('createArticle on Articles controller');

      res.status(201).send(article);
    })
    .catch((err) => {
      // console.log(err);
      if (err.name === 'ValidationError') {
        next(new BadReq(err.message));
      }
    })
    .catch((err) => {
      // console.log(err);
      next(err);
    });
};

const deleteArticle = (req, res, next) => {
  const { _id } = req.params;
  Article.findById(_id)
    .orFail(() => {
      throw new NotFound('Article is not found');
    })
    .then((article) => {
      if (!article.owner.equals(req.user._id)) {
        next(new Forbidden("You can't delete someone else's Article"));
      } else {
        Article.findByIdAndRemove(_id)
          .then((article) => res.status(200).send(article));
      }
    })
    .catch((err) => {
      // console.log(err);
      next(err);
    });
};

/* const updateLikes = (req, res, operator, next) => {
  const { articleId } = req.params;
  const { _id } = req.user;
  // console.log(operator);
  Article.findByIdAndUpdate(
    articleId,
    { [operator]: { likes: _id } }, // add _id to the array if it's not there yet
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Article is not found');
    })
    .then((Article) => res.status(200).send(Article))
    .catch((err) => {
    //  console.log(err);
      next(err);
    });
};

const likeArticle = (req, res, next) => updateLikes(req, res, '$addToSet', next);

const dislikeArticle = (req, res, next) => updateLikes(req, res, '$pull', next); */

module.exports = {
  createArticle, deleteArticle, getAllArticles,
};
