const User = require('../models/user');
const { usernameRegex, getHashed } = require('../utils/util');
const jwt = require('../utils/jwt');
const ROLES = require('../constants/roles.js');
const Subscription = require('../models/subscription');
const APIError = require('../utils/error');
// const nodemailer = require('../nodemailer');

const controller = {};

// get user's own profile
controller.getUser = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const user = await User.findOne({ _id });

    res.send({ ...user.toObject() });
  } catch (e) {
    next(e);
  }
};

// register user
controller.registerUser = async (req, res, next) => {
  try {
    // destruct and validate customer/user data
    const {
      role, // to remove auto admin assignment
      ...data
    } = req.body;

    const { email, fullName, password, username } = data;

    const alreadyExists = await User.exists({
      $or: [{ email }, { username }],
    });

    if (alreadyExists) {
      return res.status(400).send({
        message: `Email or Username is already registered`,
      });
    }

    if (!username || !usernameRegex.test(username)) {
      return res.status(400).send({
        message: `Username is not valid`,
      });
    }

    const freeSub = await Subscription.findOne({ pricePerMonth: 0 });

    // create new user
    const user = new User({
      email,
      fullName,
      password: await getHashed(password),
      username,
      subscription: freeSub._id,
    });

    // save user
    await user.save();

    res.send({
      message: 'User created',
      success: true,
    });
  } catch (e) {
    next(e);
  }
};

// login user
controller.loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // find user
    const user = await User.findByCredentials(username, password);

    const userData = {
      _id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role || ROLES.USER,
      username: user.username,
      subscription: user.subscription,
    };

    // generate auth token
    const token = await jwt.generateToken(userData);

    // send response
    res.send({ ...userData, token });
  } catch (e) {
    next(e);
  }
};

// update user subscription
controller.updateSubscription = async (req, res, next) => {
  try {
    const { cardNumber, subscriptionId } = req.body;

    const { user } = req;

    const subscription = await Subscription.findById(subscriptionId).lean();

    if (!subscription) throw new APIError('Subscription not found', 403);

    const { error, success } = await mockPayment(
      cardNumber,
      subscription.pricePerMonth
    );

    if (!success) throw new APIError(error, 403);

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          subscription: subscription._id,
          expiresAt: getNextMonthFromNow(),
        },
      }
    );

    // send response
    res.send({
      success: true,
      message: 'Subscription Updated',
    });
  } catch (e) {
    next(e);
  }
};

module.exports = controller;

async function mockPayment(_cardNumber, _amount) {
  return new Promise((resolve, _reject) => {
    const result = {
      success: false,
      error: 'Payment declined',
    };

    setTimeout(() => {
      // randomly resolve or reject
      if (Math.random() < 0.5) {
        result.success = true;
        result.error = null;
      }

      resolve(result);
    }, 1000);
  });
}

function getNextMonthFromNow() {
  const now = new Date();
  const current = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return current.toISOString();
}
