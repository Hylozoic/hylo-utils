import { validateUser } from '../src/validators'

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
