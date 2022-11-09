require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
//const usersRoute = require('./routes/usersRoute');
//const articlesRoute = require('./routes/articlesRoute');
const router = require('./routes');
const auth = require('./middleware/auth');
const handleCentralError = require('./middleware/handleCentralError');
const {requestLogger, errorLogger} = require('./middleware/logger');

console.log(process.env.NODE_ENV);

const { PORT = 3000 } = process.env;
const { MONGODB_URI = 'mongodb://localhost:27017/aroundb'} = process.env;
const app = express();


mongoose.connect(MONGODB_URI);


// include these before other routes
app.use(cors());
app.options('*', cors()); //enable requests for all routes

const allowedOrigins = [

  'http://localhost:3000',
  'https://api.articlemonkeys.students.nomoredomainssbs.ru',
  'http://articlemonkeys.students.nomoredomainssbs.ru',
];

app.use(cors({ origin: allowedOrigins }));

app.use(requestLogger);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

//usersRoute.use(auth);
//articlesRoute.use(auth);
app.use(handleCentralError);
app.use(errorLogger);

app.use(errors());


/*app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133', // paste the _id of the test user created in the previous step
  };

  next();
});*/

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});


app.use((req, res) => {
  res.status(404).send({ message: 'The requested resource was not found' });
});


app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});