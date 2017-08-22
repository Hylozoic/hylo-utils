import * as text from '../src/text'

describe('threadNames', () => {
  it('handles single name correctly', () => {
    const expected = 'Constantine'
    const actual = text.threadNames([ 'Constantine' ])
    expect(actual).toBe(expected)
  })

  it('handles two names correctly', () => {
    const expected = 'Constantine & Bartholemew'
    const actual = text.threadNames([ 'Constantine', 'Bartholemew' ])
    expect(actual).toBe(expected)
  })

  it('handles nine names correctly', () => {
    const expected = 'Constantine & 8 others'
    const actual = text.threadNames([
      'Constantine',
      'Bartholemew',
      'Gertrude',
      'Hortense',
      'Abner',
      'Zachariah',
      'Philomena',
      'Zebediah',
      'Augustus'
    ])
    expect(actual).toBe(expected)
  })
})
