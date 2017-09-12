'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.truncate = exports.increment = exports.markdown = undefined;
exports.sanitize = sanitize;
exports.present = present;
exports.appendInP = appendInP;
exports.textLength = textLength;
exports.humanDate = humanDate;
exports.threadNames = threadNames;

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _insane = require('insane');

var _insane2 = _interopRequireDefault(_insane);

var _truncHtml = require('trunc-html');

var _truncHtml2 = _interopRequireDefault(_truncHtml);

var _linkify = require('./linkify');

var _linkify2 = _interopRequireDefault(_linkify);

var _prettyDate = require('pretty-date');

var _prettyDate2 = _interopRequireDefault(_prettyDate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sanitize(text) {
  if (!text) return '';

  // remove leading &nbsp; (a side-effect of contenteditable)
  var strippedText = text.replace(/<p>&nbsp;/gi, '<p>');

  return (0, _insane2.default)(strippedText, {
    allowedTags: ['a', 'p', 'br', 'ul', 'ol', 'li', 'strong', 'em'],
    allowedAttributes: {
      'a': ['href', 'data-user-id', 'data-entity-type']
    }
  });
}

var markdown = exports.markdown = function markdown(text) {
  _marked2.default.setOptions({ gfm: true, breaks: true });
  return (0, _marked2.default)(text || '');
};

// increment the number at the end of a string.
// foo => foo2, foo2 => foo3, etc.
var increment = exports.increment = function increment(text) {
  var regex = /\d*$/;
  var word = text.replace(regex, '');
  var number = Number(text.match(regex)[0] || 1) + 1;
  return '' + word + number;
};

var truncate = exports.truncate = function truncate(text, length) {
  return (0, _truncHtml2.default)(text, length, {
    sanitizer: {
      allowedAttributes: { a: ['href', 'class', 'data-search'] }
    }
  }).html;
};

function present(text) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!text) return '';

  // wrap in a <p> tag, do this by default, require opt out
  if (text.substring(0, 3) !== '<p>' && !opts.noP) text = '<p>' + text + '</p>';

  // make links and hashtags
  text = (0, _linkify2.default)(text, opts.slug);

  if (opts.maxlength) text = truncate(text, opts.maxlength);
  return text;
}

function appendInP(text, appendee) {
  text = text.trim();
  if (text.substr(text.length - 4) === '</p>') {
    return text.substr(0, text.length - 4) + appendee + '</p>';
  } else {
    return text + appendee;
  }
}

function textLength(html) {
  return html.replace(/<[^>]+>/g, '').length;
}

function humanDate(date, short) {
  var isString = typeof date === 'string';
  var isValidDate = !isNaN(Number(date)) && Number(date) !== 0;
  var ret = date && (isString || isValidDate) ? _prettyDate2.default.format(isString ? new Date(date) : date) : '';
  if (short) {
    ret = ret.replace(' ago', '');
  } else {
    // this workaround prevents a "React attempted to use reuse markup" error
    // which happens if the timestamp is less than 1 minute ago, because the
    // server renders "N seconds ago", but by the time React is loaded on the
    // client side, it's "N+1 seconds ago"
    var match = ret.match(/(\d+) seconds? ago/);
    if (match) {
      if (Number(match[1]) >= 50) return '1m ago';
      return 'just now';
    }
  }
  ret = ret.replace(/ minutes?/, 'm').replace(/ hours?/, 'h').replace(/ days?/, 'd').replace(/ weeks?/, 'w').replace(/ month(s?)/, ' mo$1');
  return ret;
}

// Assumes current user has already been filtered from `names`
function threadNames(names) {
  if (names.length < 3) return names.join(' & ');
  return names[0] + ' & ' + (names.length - 1) + ' others';
}