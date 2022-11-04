const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Jacques Cousteau',
    required: true,
    minLength: [2, 'The minimum length is 2'],
    maxLength: [30, 'The maximum length is 30'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Please enter the valid email',
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 2,
    select: false,
    validate: {
      validator(v) {
        return v;
      },
      message: 'Please enter the valid password',
    },
  },
});

// adding findUserByCredentials to userSchema.statics object
userSchema.statics.findUserByCredentials = function (email, password) {
  // we refer to the User model as `this`
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      // user not found -- reject
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }
      // user found -- check its password
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Incorrect email or password'));
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);