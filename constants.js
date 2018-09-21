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

var AnalyticsEvents = exports.AnalyticsEvents = {
  COMMENT_CREATED: 'Comment Created',
  COMMUNITY_CREATED: 'Community Created',
  COMMUNITY_INVITATION_ACCEPTED: 'Community Invitation Accepted',
  DIRECT_MESSAGE_SENT: 'Direct Message Sent',
  POST_CREATED: 'Post Created',
  POST_UPDATED: 'Post Updated',
  TOPIC_CREATED: 'Topic Created',
  VOTED_ON_POST: 'Voted on Post',
  BLOCK_USER: 'User Blocked',
  UNBLOCK_USER: 'User Un-Blocked'
};