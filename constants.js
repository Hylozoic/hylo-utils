'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

// These are used when creating posts and comments with mentions and topic tags
// in them. The reason TOPIC_ENTITY_TYPE is '#mention' as opposed to something
// more human-understandable has something to do with the Draft.js plugin used
// in hylo-evo. Ask Loren :)
var MENTION_ENTITY_TYPE = exports.MENTION_ENTITY_TYPE = 'mention';
var TOPIC_ENTITY_TYPE = exports.TOPIC_ENTITY_TYPE = '#mention';