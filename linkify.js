"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = linkify;
exports.linkifyHashtags = linkifyHashtags;

var _string = _interopRequireDefault(require("linkifyjs/string"));

var _lodash = require("lodash");

var _cheerio = _interopRequireDefault(require("cheerio"));

var _hashtag = require("./hashtag");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// this loads the hashtag-parsing plugin
require('linkifyjs/plugins/hashtag')(require('linkifyjs'));

var maxLinkLength = 48;

function tagUrl(tagName, slug) {
  if (slug) {
    return "/c/".concat(slug, "/tag/").concat(tagName);
  } else {
    return "/tag/".concat(tagName);
  }
}

function mentionUrl(memberId, slug) {
  if (slug) {
    return "/c/".concat(slug, "/m/").concat(memberId);
  } else {
    return "/m/".concat(memberId);
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
      if (type === 'hashtag') return {
        'data-search': value
      };
    },
    linkClass: function linkClass(href, type) {
      return type === 'hashtag' ? 'hashtag' : 'linkified';
    }
  };
} // unlike the linkifyjs module, this handles text that may already have html
// tags in it. it does so by generating a DOM from the text and linkifying only
// text nodes that aren't inside A tags.


function linkify(text, slug) {
  var $ = _cheerio["default"].load(text, {
    _useHtmlParser2: true
  }); // caveat: this isn't intended to handle arbitrarily complex html


  var run = function run(node) {
    return node.contents().map(function (i, el) {
      if (el.type === 'text') return (0, _string["default"])(el.data, linkifyjsOptions(slug));
      if (el.name === 'br') return $.html(el);
      if (el.name === 'a') return cleanupLink($, el, slug);
      return recurse($, el, run);
    }).get().join('');
  };

  return run($.root());
}

function recurse($, el, fn) {
  var attrs = !(0, _lodash.isEmpty)(el.attribs) ? ' ' + (0, _lodash.toPairs)(el.attribs).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];

    return "".concat(k, "='").concat(v, "'");
  }).join(' ') : '';
  return "<".concat(el.name).concat(attrs, ">").concat(fn($(el)), "</").concat(el.name, ">");
}

function cleanupLink($, el, slug) {
  var $el = $(el);
  var text = $el.text();

  if ($el.data('entity-type') === 'mention') {
    var memberId = $el.data('user-id');
    $el.attr('href', mentionUrl(memberId, slug));
    $el.attr('class', 'mention');
  } else {
    var match = text.match(_hashtag.hashtagFullRegex);

    if (match) {
      $el.attr('href', tagUrl(match[1], slug));
      $el.attr('data-search', match[0]);
      $el.attr('class', 'hashtag');
    }
  }

  if (text.length >= maxLinkLength) {
    $el.text(text.slice(0, maxLinkLength) + '…');
  }

  return $.html(el);
}

function linkifyHashtags(text, slug) {
  // this takes plain text and returns html.
  // It makes links out of hashtags but ignores urls
  return (0, _string["default"])(text, (0, _lodash.merge)(linkifyjsOptions(slug), {
    validate: function validate(value, type) {
      return type === 'hashtag';
    }
  }));
}