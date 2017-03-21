const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    // store assertion in response
    var res = isRealString(98);
    // asset from matches value passed in
    expect(res).toBe(false);
  });
  it('should reject strings with only spaces', () => {
    var res = isRealString('    ');
    expect(res).toBe(false);
  });
  it('should allow strings with non-space characters', () => {
    var res = isRealString(' f ');
    expect(res).toBe(true);
  });
});
