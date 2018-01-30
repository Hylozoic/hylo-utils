import { validateFlaggedItem, validateTopicName, validateUser } from '../src/validators'

describe('validateUser', () => {
  describe('password', () => {
    it('catches combination of tab and space characters', () => {
      expect(validateUser.password(' 	    	     ')).not.toBe(null)
    })

    it('catches short passwords', () => {
      expect(validateUser.password('aaa')).not.toBe(null)
    })

    it('allows good passwords', () => {
      expect(validateUser.password('4#V;^9wLt6z G2CYa')).toBe(null)
    })
  })

  describe('name', () => {
    it('catches combination of tab and space characters', () => {
      expect(validateUser.name(' 	    	     ')).not.toBe(null)
    })
  })
})

describe('validateFlaggedItem', () => {
  describe('reason', () => {
    it('catches combination of tab and space characters', () => {
      expect(validateFlaggedItem.reason(' 	    	     ')).not.toBe(null)
    })

    it('rejects very long strings', () => {
      const longString = new Array(10000).join('a')
      expect(validateFlaggedItem.reason(longString)).not.toBe(null)
    })
  })

  describe('link', () => {
    it('accepts Hylo subdomains', () => {
      expect(validateFlaggedItem.link('https://legacy.hylo.com/foo/bar')).toBe(null)
    })

    it('rejects other domains', () => {
      expect(validateFlaggedItem.link('https://flargleargle.org/borf/spoon')).not.toBe(null)
    })
  })
})

describe('validateTopicName', () => {
  it('rejects very long names', () => {
    const longString = new Array(1000).join('a')
    expect(validateTopicName(longString)).not.toBe(null)
  })

  it('rejects single character names', () => {
    expect(validateTopicName('x')).not.toBe(null)
  })
})
