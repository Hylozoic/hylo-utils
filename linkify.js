'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = linkify;
exports.linkifyHashtags = linkifyHashtags;

var _string = require('linkifyjs/string');

var _string2 = _interopRequireDefault(_string);

var _lodash = require('lodash');

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _hashtag = require('./hashtag');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var maxLinkLength = 48;

function tagUrl(tagName, slug) {
  if (slug) {
    return '/c/' + slug + '/tag/' + tagName;
  } else {
    return '/tag/' + tagName;
  }
}

function linkifyjsOptions(slug) {
  return {
    format: function format(value, type) {
      return type === 'url' && value.length > maxLinkLength ? value.slice(0, maxLinkLength) + '…' : value;
    },

    formatHref: function formatHref(value, type) {
      if (type === 'hashtag') {
        return tagUrl(value.substring(1), slug);
      }
      return value;
    },
    linkAttributes: function linkAttributes(value, type) {
      if (type === 'hashtag') return { 'data-search': value };
    },
    linkClass: function linkClass(href, type) {
      return type === 'hashtag' ? 'hashtag' : 'linkified';
    }
  };
}

// unlike the linkifyjs module, this handles text that may already have html
// tags in it. it does so by generating a DOM from the text and linkifying only
// text nodes that aren't inside A tags.
function linkify(text, slug) {
  var $ = _cheerio2.default.load(text);

  // caveat: this isn't intended to handle arbitrarily complex html
  var run = function run(node) {
    return node.contents().map(function (i, el) {
      if (el.type === 'text') return (0, _string2.default)(el.data, linkifyjsOptions(slug));
      if (el.name === 'br') return $.html(el);
      if (el.name === 'a') return cleanupLink($, el, slug);
      return recurse($, el, run);
    }).get().join('');
  };

  return run($.root());
}

function recurse($, el, fn) {
  var attrs = !(0, _lodash.isEmpty)(el.attribs) ? ' ' + (0, _lodash.toPairs)(el.attribs).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var k = _ref2[0];
    var v = _ref2[1];
    return k + '=\'' + v + '\'';
  }).join(' ') : '';

  return '<' + el.name + attrs + '>' + fn($(el)) + '</' + el.name + '>';
}

function cleanupLink($, el, slug) {
  var $el = $(el);
  var text = $el.text();
  var match = text.match(_hashtag.hashtagFullRegex);
  if (match) {
    $el.attr('href', tagUrl(match[1], slug));
    $el.attr('data-search', match[0]);
    $el.attr('class', 'hashtag');
  }

  if (text.length >= maxLinkLength) {
    $el.text(text.slice(0, maxLinkLength) + '…');
  }

  return $.html(el);
}

function linkifyHashtags(text, slug) {
  // this takes plain text and returns html.
  // It makes links out of hashtags but ignores urls
  return (0, _string2.default)(text, (0, _lodash.merge)(linkifyjsOptions(slug), {
    validate: function validate(value, type) {
      return type === 'hashtag';
    }
  }));
}