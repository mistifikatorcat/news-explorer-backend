const router = require('express').Router();

const { validateAuth, validateUserBody } = require('../middleware/validation');
const auth = require('../middleware/auth');

const { createUser, login } = require('../controllers/users');
const userRoute = require('./usersRoute');
const articleRoute = require('./articlesRoute');
const { emptyRoute } = require('./emptyRoute');

router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateAuth, login);

router.use(auth);

router.use('/users', userRoute);
router.use('/articles', articleRoute);
router.use('/', emptyRoute);

module.exports = router;
