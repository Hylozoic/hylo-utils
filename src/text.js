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
  marked.setOptions({gfm: true, breaks: true, sanitize: false})
  return marked(text || '')
}
