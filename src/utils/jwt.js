const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const controller = {};

controller.generateToken = async payload => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, { expiresIn: '6h' }, (err, token) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(token);
    });
  });
};

controller.verifyToken = async Authorization => {
  return new Promise((resolve, reject) => {
    const token = Authorization.replace('Bearer ', '');
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(decoded);
    });
  });
};

controller.getTokenData = async req => {
  try {
    const token = req.header('Authorization');
    if (!token) return {};
    const decoded = await controller.verifyToken(token);
    return decoded;
  } catch (e) {
    return {};
  }
};

module.exports = controller;
