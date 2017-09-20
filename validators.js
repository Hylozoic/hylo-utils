'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateFlaggedItem = exports.validateUser = undefined;

var _lodash = require('lodash');

var _validator = require('validator');

var onlyWhitespace = function onlyWhitespace(s) {
  return s.trim() === '' ? 'must not consist solely of whitespace' : null;
};

var lengthGreaterThan = function lengthGreaterThan(length) {
  return function (s) {
    return s.length > length ? 'must be less than ' + length + ' characters' : null;
  };
};

var lengthLessThan = function lengthLessThan(length) {
  return function (s) {
    return s.length < length ? 'must be at least ' + length + ' characters' : null;
  };
};

var notHyloUrl = function notHyloUrl(link) {
  return !(0, _validator.isURL)(link, { host_whitelist: [/.*hylo\.com/] }) ? 'must be a valid Hylo URL' : null;
};

// Validators return a string describing the error if invalid, or null if valid.
var validateUser = exports.validateUser = {
  password: function password(_password) {
    if (typeof _password !== 'string') return 'Password must be a string';
    var validators = [onlyWhitespace, lengthLessThan(9)];
    var invalidReasons = (0, _lodash.compact)(validators.map(function (validator) {
      return validator(_password);
    }));
    return invalidReasons.length ? 'Password ' + invalidReasons.join(', ') + '.' : null;
  },


  // Note: the user's full name, _not_ a login field (we use email for that)
  name: function name(_name) {
    if (typeof _name !== 'string') return 'Name must be a string.';
    var validators = [onlyWhitespace];
    var invalidReasons = (0, _lodash.compact)(validators.map(function (validator) {
      return validator(_name);
    }));
    return invalidReasons.length ? 'Name ' + invalidReasons.join(', ') + '.' : null;
  }
};

var validateFlaggedItem = exports.validateFlaggedItem = {
  reason: function reason(_reason) {
    if (typeof _reason !== 'string') return 'Reason must be a string.';
    var validators = [onlyWhitespace, lengthGreaterThan(5000)];
    var invalidReasons = (0, _lodash.compact)(validators.map(function (validator) {
      return validator(_reason);
    }));
    return invalidReasons.length ? 'Reason ' + invalidReasons.join(', ') + '.' : null;
  },
  link: function link(_link) {
    if (typeof _link !== 'string') return 'Link must be a string.';
    var validators = [notHyloUrl];
    var invalidReasons = (0, _lodash.compact)(validators.map(function (validator) {
      return validator(_link);
    }));
    return invalidReasons.length ? 'Link ' + invalidReasons.join(', ') + '.' : null;
  }
};