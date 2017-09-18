import { compact } from 'lodash'
import { isURL } from 'validator'

const onlyWhitespace = s => s.trim() === '' ? 'must not consist solely of whitespace' : null

const lengthGreaterThan = length => s => s.length > length ? `must be less than ${length} characters` : null

const lengthLessThan = length => s => s.length < length ? `must be at least ${length} characters` : null

const notHyloUrl = link => !isURL(link, { host_whitelist: [ /.*hylo\.com/ ] }) ? 'must be a valid Hylo URL' : null

// Validators return a string describing the error if invalid, or null if valid.
export const validateUser = {
  password (password) {
    const validators = [ onlyWhitespace, lengthLessThan(9) ]
    const invalidReasons = compact(validators.map(validator => validator(password)))
    return invalidReasons.length ? `Password ${invalidReasons.join(', ')}.` : null
  },

  // Note: the user's full name, _not_ a login field (we use email for that)
  name (name) {
    const validators = [ onlyWhitespace ]
    const invalidReasons = compact(validators.map(validator => validator(name)))
    return invalidReasons.length ? `Name ${invalidReasons.join(', ')}.` : null
  }
}

export const validateFlaggedItem = {
  reason (reason) {
    const validators = [ onlyWhitespace, lengthGreaterThan(5000) ]
    const invalidReasons = compact(validators.map(validator => validator(reason)))
    return invalidReasons.length ? `Reason ${invalidReasons.join(', ')}.` : null
  },

  link (link) {
    const validators = [ notHyloUrl ]
    const invalidReasons = compact(validators.map(validator => validator(link)))
    return invalidReasons.length ? `Link ${invalidReasons.join(', ')}.` : null
  }
}
