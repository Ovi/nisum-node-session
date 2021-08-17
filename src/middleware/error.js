const middleware = async (err, req, res, next) => {
  if (err) {
    console.log('*-*-* [start] error *-*-*');
    console.log(err);
    console.log('*-*-* [end] error *-*-*');

    if (err.code === 11000) {
      // any unique field could violate the unique index. we need to find out which field it was.
      let field = err.message.split('.$')[1];
      const duplicate = err.message.split('"')[1];
      [field] = field?.split(' dup key');
      field = field?.substring(0, field.lastIndexOf('_'));

      return res.status(400).send({
        message: `An account with this ${field} (${duplicate}) already exists!`,
      });
    }

    if (err.message === 'jwt expired') {
      return res.status(401).send({ ...err, message: 'Token Expired!' });
    }

    if (err.message === 'Invalid Token') {
      return res.status(401).send({ ...err, message: 'Invalid Token!' });
    }

    const error = {
      message: err.message,
    };

    res.status(err.status || 500);

    if (err.errors) {
      error.errors = err.errors;
    }

    if (err.code && err.code === 'auth/id-token-expired') {
      res.status(401);
      error.message = 'Session expired.';
    }

    if (!error.message) {
      switch (err.status) {
        case 401:
          error.message = `You don't have enough permission.`;
          break;

        case 403:
          error.message = `Access Denied.`;
          break;

        default:
          error.message = `Something went wrong.`;
      }
    }

    res.send(error);
    return;
  }

  next();
};

module.exports = middleware;
