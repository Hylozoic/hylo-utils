"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hashtagFullRegex = exports.hashtagWordRegex = exports.hashtagCharacterRegex = exports.invalidCharacterRegex = void 0;
var invalidCharacterRegex = /[^\w_-]/;
exports.invalidCharacterRegex = invalidCharacterRegex;
var hashtagCharacterRegex = /^[\w_-]$/;
exports.hashtagCharacterRegex = hashtagCharacterRegex;
var hashtagWordRegex = /^[A-Za-z][\w_-]+$/;
exports.hashtagWordRegex = hashtagWordRegex;
var hashtagFullRegex = /^#([A-Za-z][\w_-]+)$/;
exports.hashtagFullRegex = hashtagFullRegex;