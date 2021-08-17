const mongoose = require('mongoose');
const APIError = require('../utils/error');
const ROLES = require('../constants/roles.js');
const { usernameRegex } = require('../utils/util');

const { ObjectId } = mongoose.Types;

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      lowercase: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },

    fullName: {
      required: true,
      trim: true,
      type: String,
    },

    password: {
      minlength: 6,
      required: true,
      type: String,
    },

    subscription: {
      autopopulate: { select: 'name pricePerMonth' },
      ref: 'Subscription',
      type: ObjectId,
    },

    expiresAt: {
      type: Date,
    },

    role: {
      default: ROLES.USER,
      type: String,
    },

    username: {
      minlength: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.metaData;

  return userObject;
};

UserSchema.statics.findByCredentials = async (username, password) => {
  const bcrypt = require('bcrypt');

  const query = {};

  const isEmail = !usernameRegex.test(username.toLowerCase());

  if (isEmail) {
    query.email = username;
  } else {
    query.username = new RegExp(`^${username}$`, 'i');
  }

  const user = await User.findOne(query);

  if (!user) throw new APIError('Invalid Credentials', 422);

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new APIError('Invalid Credentials', 422);
  }

  return user;
};

UserSchema.plugin(require('mongoose-autopopulate'));

const User = mongoose.model('User', UserSchema);

module.exports = User;
