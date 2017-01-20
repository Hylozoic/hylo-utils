'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.incrementLabel = exports.markdown = undefined;
exports.sanitize = sanitize;

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _insane = require('insane');

var _insane2 = _interopRequireDefault(_insane);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sanitize(text) {
  if (!text) return '';

  // remove leading &nbsp; (a side-effect of contenteditable)
  var strippedText = text.replace(/<p>&nbsp;/gi, '<p>');

  return (0, _insane2.default)(strippedText, {
    allowedTags: ['a', 'p', 'br', 'ul', 'ol', 'li', 'strong', 'em'],
    allowedAttributes: {
      'a': ['href', 'data-user-id']
    }
  });
}

var markdown = exports.markdown = function markdown(text) {
  _marked2.default.setOptions({ gfm: true, breaks: true });
  return (0, _marked2.default)(text || '');
};

// increment the number at the end of a string.
// foo => foo2, foo2 => foo3, etc.
var incrementLabel = exports.incrementLabel = function incrementLabel(label) {
  var regex = /\d*$/;
  var word = label.replace(regex, '');
  var number = Number(label.match(regex)[0] || 1) + 1;
  return '' + word + number;
};