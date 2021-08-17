const bcrypt = require('bcrypt');
const ENV_VARIABLES = require('../constants/env-variables');

const utils = {};

utils.validateEnvVar = () => {
  const unsetEnv = ENV_VARIABLES.filter(
    (env) => !(typeof process.env[env] !== 'undefined')
  );

  if (unsetEnv.length > 0) {
    throw new Error(
      `Required ENV variables are not set: [${unsetEnv.join(', ')}]`
    );
  }
};

utils.usernameRegex = /^[a-zA-Z0-9]*$/;

utils.getHashed = async (str) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(str || '', salt);

  return hashed;
};

utils.mongooseOptions = {
  regexFinder: (something) => ({ $options: 'i', $regex: something }),
  updateMerge: { new: true, setDefaultsOnInsert: true, upsert: true },
};

utils.truncateString = (string = '', length = 30) => {
  if (string.length <= length + 3) return string;

  return string.length < length ? string : `${string.slice(0, length - 3)}...`;
};

utils.truncateStringMiddle = (string, length = 30, start = 10, end = 10) => {
  if (string.length < length) return string;
  return `${string.slice(0, start)}...${string.slice(string.length - end)}`;
};

module.exports = utils;
