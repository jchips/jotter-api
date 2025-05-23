'use strict';

module.exports = function (req, res, next) {
  const errorObject = {
    status: 404,
    message: 'Sorry, we could not find what you were looking for',
  };

  try {
    res.status(404).json(errorObject);
  } catch (err) {
    next(err);
  }
};
