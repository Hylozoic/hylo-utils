"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.divToP = divToP;
exports.sanitize = sanitize;
exports.present = present;
exports.appendInP = appendInP;
exports.textLength = textLength;
exports.humanDate = humanDate;
exports.threadNames = threadNames;
exports.truncate = exports.increment = exports.markdown = void 0;

var _cheerio = _interopRequireDefault(require("cheerio"));

var _marked = _interopRequireDefault(require("marked"));

var _insane = _interopRequireDefault(require("insane"));

var _truncHtml = _interopRequireDefault(require("trunc-html"));

var _linkify = _interopRequireDefault(require("./linkify"));

var _prettyDate = _interopRequireDefault(require("pretty-date"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Replace any div tag with p. Note that this drops all attributes from the tag.
function divToP(text) {
  if (!text || typeof text !== 'string') return '';

  var $ = _cheerio["default"].load(text, null, false);

  $('div').replaceWith(function () {
    return $('<p>' + $(this).html() + '</p>');
  });
  return $.html();
}

function sanitize(text, whitelist, attrWhitelist) {
  if (!text) return '';
  if (whitelist && !Array.isArray(whitelist)) return ''; // remove leading &nbsp; (a side-effect of contenteditable)

  var strippedText = text.replace(/<p>&nbsp;/gi, '<p>');
  return (0, _insane["default"])(strippedText, {
    allowedTags: whitelist || ['a', 'br', 'em', 'li', 'ol', 'p', 'strong', 'ul'],
    allowedAttributes: attrWhitelist || {
      'a': ['href', 'data-user-id', 'data-entity-type']
    }
  });
}

var markdown = function markdown(text) {
  _marked["default"].setOptions({
    gfm: true,
    breaks: true
  });

  return (0, _marked["default"])(text || '');
}; // increment the number at the end of a string.
// foo => foo2, foo2 => foo3, etc.


exports.markdown = markdown;

var increment = function increment(text) {
  var regex = /\d*$/;
  var word = text.replace(regex, '');
  var number = Number(text.match(regex)[0] || 1) + 1;
  return "".concat(word).concat(number);
};

exports.increment = increment;

var truncate = function truncate(text, length) {
  return (0, _truncHtml["default"])(text, length, {
    sanitizer: {
      allowedAttributes: {
        a: ['href', 'class', 'data-search']
      }
    }
  }).html;
};

exports.truncate = truncate;

function present(text) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!text) return ''; // wrap in a <p> tag, do this by default, require opt out

  if (text.substring(0, 3) !== '<p>' && !opts.noP) text = "<p>".concat(text, "</p>"); // make links and hashtags

  if (!opts.noLinks) text = (0, _linkify["default"])(text, opts.slug);
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

function humanDate(date, _short) {
  var isString = typeof date === 'string';
  var isValidDate = !isNaN(Number(date)) && Number(date) !== 0;
  var ret = date && (isString || isValidDate) ? _prettyDate["default"].format(isString ? new Date(date) : date) : '';

  if (_short) {
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
} // Assumes current user has already been filtered from `names`


function threadNames(names) {
  if (names.length < 3) return names.join(' & ');
  return "".concat(names[0], " & ").concat(names.length - 1, " others");
}