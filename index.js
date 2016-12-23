"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var djb2Hash = function djb2Hash(str) {
  var hash = 5381;
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = (hash << 5) + hash + char;
  }
  return hash;
};

// returns 0 or 1, grouping users into unique groups.
// Example usage:
//  if (groupUser(user.id, 'Popular Skill Engagement Module') === 1) {
//    ... display module ...
// }
var groupUser = exports.groupUser = function groupUser(id, groupName) {
  var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
  return Math.abs(id * djb2Hash(groupName) >> 3) % n;
};