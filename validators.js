"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateTopicName = exports.validateFlaggedItem = exports.validateUser = exports.notHyloUrl = exports.lengthLessThan = exports.lengthGreaterThan = exports.onlyWhitespace = exports.hasWhitespace = exports.isRelativePath = exports.hasDisallowedCharacters = void 0;

var _lodash = require("lodash");

var _validator = require("validator");

// Validators return a string describing the error if invalid, or null if valid.
var hasDisallowedCharacters = function hasDisallowedCharacters(blacklist) {
  return function (s) {
    return new RegExp("[".concat(blacklist, "]")).exec(s) ? "must not contain any of ".concat(blacklist) : null;
  };
}; // This is an anti-relative path rule, just trying to avoid the jargon


exports.hasDisallowedCharacters = hasDisallowedCharacters;

var isRelativePath = function isRelativePath(s) {
  return /^\.\.?\/?/.exec(s) ? 'must not start with periods' : null;
};

exports.isRelativePath = isRelativePath;

var hasWhitespace = function hasWhitespace(s) {
  return /\s/.exec(s) ? 'must not contain whitespace' : null;
};

exports.hasWhitespace = hasWhitespace;

var onlyWhitespace = function onlyWhitespace(s) {
  return s.trim() === '' ? 'must not consist solely of whitespace' : null;
};

exports.onlyWhitespace = onlyWhitespace;

var lengthGreaterThan = function lengthGreaterThan(length) {
  return function (s) {
    return s.length > length ? "must be no more than ".concat(length, " characters") : null;
  };
};

exports.lengthGreaterThan = lengthGreaterThan;

var lengthLessThan = function lengthLessThan(length) {
  return function (s) {
    return s.length < length ? "must be at least ".concat(length, " characters") : null;
  };
};

exports.lengthLessThan = lengthLessThan;

var notHyloUrl = function notHyloUrl(link) {
  return !(0, _validator.isURL)(link, {
    host_whitelist: [/.*hylo\.com/]
  }) ? 'must be a valid Hylo URL' : null;
};

exports.notHyloUrl = notHyloUrl;
var validateUser = {
  password: function password(_password) {
    if (typeof _password !== 'string') return 'Password must be a string';
    var validators = [onlyWhitespace, lengthLessThan(9)];
    var invalidReasons = (0, _lodash.compact)(validators.map(function (validator) {
      return validator(_password);
    }));
    return invalidReasons.length ? "Password ".concat(invalidReasons.join(', '), ".") : null;
  },
  // Note: the user's full name, _not_ a login field (we use email for that)
  name: function name(_name) {
    if (typeof _name !== 'string') return 'Name must be a string.';
    var validators = [onlyWhitespace];
    var invalidReasons = (0, _lodash.compact)(validators.map(function (validator) {
      return validator(_name);
    }));
    return invalidReasons.length ? "Name ".concat(invalidReasons.join(', '), ".") : null;
  }
};
exports.validateUser = validateUser;
var validateFlaggedItem = {
  reason: function reason(_reason) {
    if (typeof _reason !== 'string') return 'Reason must be a string.';
    var validators = [onlyWhitespace, lengthGreaterThan(5000)];
    var invalidReasons = (0, _lodash.compact)(validators.map(function (validator) {
      return validator(_reason);
    }));
    return invalidReasons.length ? "Reason ".concat(invalidReasons.join(', '), ".") : null;
  },
  link: function link(_link) {
    if (typeof _link !== 'string') return 'Link must be a string.';
    var validators = [notHyloUrl];
    var invalidReasons = (0, _lodash.compact)(validators.map(function (validator) {
      return validator(_link);
    }));
    return invalidReasons.length ? "Link ".concat(invalidReasons.join(', '), ".") : null;
  }
};
exports.validateFlaggedItem = validateFlaggedItem;

var validateTopicName = function validateTopicName(name) {
  if (typeof name !== 'string') return 'Topic name must be a string.';
  var validators = [hasDisallowedCharacters('#/'), isRelativePath, hasWhitespace, lengthGreaterThan(40), lengthLessThan(2)];
  var invalidReasons = (0, _lodash.compact)(validators.map(function (validator) {
    return validator(name);
  }));
  return invalidReasons.length ? "Topic name ".concat(invalidReasons.join(', '), ".") : null;
};

exports.validateTopicName = validateTopicName;