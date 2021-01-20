import cheerio from 'cheerio'
import marked from 'marked'
import insane from 'insane'
import truncHtml from 'trunc-html'
import linkify from './linkify'
import prettyDate from 'pretty-date'

// Replace any div tag with p. Note that this drops all attributes from the tag.
export function divToP (text) {
  if (!text || typeof text !== 'string') return ''
  var $ = cheerio.load(text)
  $('div').replaceWith(function () {
    return $('<p>' + $(this).html() + '</p>')
  })
  return $('body').html()
}

export function sanitize (text, whitelist, attrWhitelist) {
  if (!text) return ''
  if (whitelist && !Array.isArray(whitelist)) return ''

  // remove leading &nbsp; (a side-effect of contenteditable)
  const strippedText = text.replace(/<p>&nbsp;/gi, '<p>')

  return insane(strippedText, {
    allowedTags: whitelist || ['a', 'br', 'em', 'li', 'ol', 'p', 'strong', 'ul' ],
    allowedAttributes: attrWhitelist || {
      'a': ['href', 'data-user-id', 'data-entity-type']
    }
  })
}

export const markdown = text => {
  marked.setOptions({gfm: true, breaks: true})
  return marked(text || '')
}

// increment the number at the end of a string.
// foo => foo2, foo2 => foo3, etc.
export const increment = text => {
  const regex = /\d*$/
  const word = text.replace(regex, '')
  const number = Number(text.match(regex)[0] || 1) + 1
  return `${word}${number}`
}

export const truncate = (text, length) =>
  truncHtml(text, length, {
    sanitizer: {
      allowedAttributes: {a: ['href', 'class', 'data-search']}
    }
  }).html

export function present (text, opts = {}) {
  if (!text) return ''

  // wrap in a <p> tag, do this by default, require opt out
  if (text.substring(0, 3) !== '<p>' && !opts.noP) text = `<p>${text}</p>`

  // make links and hashtags
  if (!opts.noLinks) text = linkify(text, opts.slug)

  if (opts.maxlength) text = truncate(text, opts.maxlength)
  return text
}

export function appendInP (text, appendee) {
  text = text.trim()
  if (text.substr(text.length - 4) === '</p>') {
    return text.substr(0, text.length - 4) + appendee + '</p>'
  } else {
    return text + appendee
  }
}

export function textLength (html) {
  return html.replace(/<[^>]+>/g, '').length
}

export function humanDate (date, short) {
  const isString = typeof date === 'string'
  const isValidDate = !isNaN(Number(date)) && Number(date) !== 0
  var ret = date && (isString || isValidDate)
    ? prettyDate.format(isString ? new Date(date) : date)
    : ''
  if (short) {
    ret = ret.replace(' ago', '')
  } else {
    // this workaround prevents a "React attempted to use reuse markup" error
    // which happens if the timestamp is less than 1 minute ago, because the
    // server renders "N seconds ago", but by the time React is loaded on the
    // client side, it's "N+1 seconds ago"
    let match = ret.match(/(\d+) seconds? ago/)
    if (match) {
      if (Number(match[1]) >= 50) return '1m ago'
      return 'just now'
    }
  }
  ret = ret.replace(/ minutes?/, 'm')
  .replace(/ hours?/, 'h')
  .replace(/ days?/, 'd')
  .replace(/ weeks?/, 'w')
  .replace(/ month(s?)/, ' mo$1')
  return ret
}

// Assumes current user has already been filtered from `names`
export function threadNames (names) {
  if (names.length < 3) return names.join(' & ')
  return `${names[0]} & ${names.length - 1} others`
}
