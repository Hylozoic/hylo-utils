import { isEmpty, toPairs } from 'lodash'
import cheerio from 'cheerio'
import linkifyString from 'linkify-string'
import 'linkify-plugin-hashtag'
import { HASHTAG_FULL_REGEX } from './constants'

const MAX_LINK_LENGTH = 48

function tagUrl (tagName, slug) {
  if (slug) {
    return `/c/${slug}/tag/${tagName}`
  } else {
    return `/tag/${tagName}`
  }
}

function mentionUrl (memberId, slug) {
  if (slug) {
    return `/c/${slug}/m/${memberId}`
  } else {
    return `/m/${memberId}`
  }
}

function linkifyjsOptions (slug) {
  return {
    format: {
      url: value =>
        value.length > MAX_LINK_LENGTH
          ? `${value.slice(0, MAX_LINK_LENGTH)}…`
          : value
    },
    formatHref: {
      hashtag: href => tagUrl(href.substring(1), slug)
    },
    attributes: (href, type) => (
      type === 'hashtag'
        ? { 'data-search': href }
        : ''
    ),
    className: (href, type) => (
      type === 'hashtag'
        ? 'hashtag'
        : 'linkified'
    ),
    target: {
      url: '_blank'
    }
  }
}

function recurse ($, el, fn) {
  const attrs = !isEmpty(el.attribs)
    ? ' ' + toPairs(el.attribs).map(([k, v]) => `${k}='${v}'`).join(' ')
    : ''

  return `<${el.name}${attrs}>${fn($(el))}</${el.name}>`
}

function cleanupLink ($, el, slug) {
  const $el = $(el)
  const text = $el.text()
  if ($el.data('entity-type') === 'mention') {
    const memberId = $el.data('user-id')
    $el.attr('href', mentionUrl(memberId, slug))
    $el.attr('class', 'mention')
  } else {
    const match = text.match(HASHTAG_FULL_REGEX)
    if (match) {
      $el.attr('href', tagUrl(match[1], slug))
      $el.attr('data-search', match[0])
      $el.attr('class', 'hashtag')
    }
  }
  if (text.length >= MAX_LINK_LENGTH) {
    $el.text(text.slice(0, MAX_LINK_LENGTH) + '…')
  }

  return $.html(el)
}

// unlike the linkifyjs module, this handles text that may already have html
// tags in it. it does so by generating a DOM from the text and linkifying only
// text nodes that aren't inside A tags.
export function linkifyHylo (text, slug) {
  // return linkifyHTML(text, linkifyjsOptions(slug))
  var $ = cheerio.load(text, null, false)
  // caveat: this isn't intended to handle arbitrarily complex html
  var run = node =>
    node.contents().map((i, el) => {
      if (el.type === 'text') return linkifyString(el.data, linkifyjsOptions(slug))
      if (el.name === 'br') return $.html(el)
      if (el.name === 'a') return cleanupLink($, el, slug)
      return recurse($, el, run)
    }).get().join('')

  return run($.root())
}
