import marked from 'marked'
import insane from 'insane'

export function sanitize (text) {
  if (!text) return ''

  // remove leading &nbsp; (a side-effect of contenteditable)
  var strippedText = text.replace(/<p>&nbsp;/gi, '<p>')

  return insane(strippedText, {
    allowedTags: ['a', 'p', 'br', 'ul', 'ol', 'li', 'strong', 'em'],
    allowedAttributes: {
      'a': ['href', 'data-user-id']
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
