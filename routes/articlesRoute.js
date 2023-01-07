const router = require('express').Router();

const { validateArticle, validateObjectId } = require('../middleware/validation');
const { getAllArticles, createArticle, deleteArticle } = require('../controllers/articles');

router.get('/', getAllArticles);
router.post('/', validateArticle, createArticle);
router.delete('/:_id', validateObjectId, deleteArticle);

module.exports = router;
