"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var invalidCharacterRegex = exports.invalidCharacterRegex = /[^\w_-]/;
var hashtagCharacterRegex = exports.hashtagCharacterRegex = /^[\w_-]$/;
var hashtagWordRegex = exports.hashtagWordRegex = /^[A-Za-z][\w_-]+$/;
var hashtagFullRegex = exports.hashtagFullRegex = /^#([A-Za-z][\w_-]+)$/;