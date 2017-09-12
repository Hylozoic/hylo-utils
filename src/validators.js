import { compact } from 'lodash'

const onlyWhitespace = s => s.trim() === '' ? `must not consist solely of whitespace` : null

const lengthLessThan = length => s => s.length < length ? `must be at least ${length} characters` : null

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
