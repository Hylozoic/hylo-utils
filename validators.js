'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateUser = undefined;

var _lodash = require('lodash');

var onlyWhitespace = function onlyWhitespace(s) {
  return s.trim() === '' ? 'must not consist solely of whitespace' : null;
};

var lengthLessThan = function lengthLessThan(length) {
  return function (s) {
    return s.length < length ? 'must be at least ' + length + ' characters' : null;
  };
};

// Validators return a string describing the error if invalid, or null if valid.
var validateUser = exports.validateUser = {
  password: function password(_password) {
    var validators = [onlyWhitespace, lengthLessThan(9)];
    var invalidReasons = (0, _lodash.compact)(validators.map(function (validator) {
      return validator(_password);
    }));
    return invalidReasons.length ? 'Password ' + invalidReasons.join(', ') + '.' : null;
  },


  // Note: the user's full name, _not_ a login field (we use email for that)
  name: function name(_name) {
    var validators = [onlyWhitespace];
    var invalidReasons = (0, _lodash.compact)(validators.map(function (validator) {
      return validator(_name);
    }));
    return invalidReasons.length ? 'Name ' + invalidReasons.join(', ') + '.' : null;
  }
};