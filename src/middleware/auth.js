const jwt = require('../utils/jwt');
const User = require('../models/user');
const APIError = require('../utils/error');
const ROLES = require('../constants/roles.js');

const userAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) throw new APIError('Authentication Problem', 403);
    const decoded = await jwt.verifyToken(token);

    const user = await User.findOne({
      _id: decoded._id,
      username: decoded.username,
    });

    if (!user) {
      throw new APIError('Invalid Token');
    }

    req.user = user;

    next();
  } catch (e) {
    next(e);
  }
};

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) throw new APIError('Authentication Problem', 403);
    const decoded = await jwt.verifyToken(token);
    const user = await User.findOne({
      _id: decoded._id,
      username: decoded.username,
    });

    if (!user) {
      throw new APIError('Invalid Token');
    }

    if (user.role !== ROLES.ADMIN) {
      throw new APIError('[admin only] You are not authorized.');
    }

    req.user = user;

    next();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  ADMIN: adminAuth,
  USER: userAuth,
};
