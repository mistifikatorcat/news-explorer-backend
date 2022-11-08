const router = require('express').Router();

const { validateAuth, validateUserBody } = require('../middleware/validation');
const auth = require('../middleware/auth');

const { createUser, login, getCurrentUser } = require('../controllers/users');

const articlesRoute = require('./articlesRoute');
const { emptyRoute } = require('./emptyRoute');

router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateAuth, login);

router.use(auth);

router.use('/users/me', getCurrentUser);
router.use('/articles', articlesRoute);
router.use('/', emptyRoute);

module.exports = router;
