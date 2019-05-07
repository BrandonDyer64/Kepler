const binding = require('../lib/binding.js')
const assert = require('assert')

describe('Kepler Core', function() {
  describe('Includes', function() {
    it('should include EntityX', function() {
      assert.equal(binding.CheckEntityXInclude(), true)
    })
    it('should include Display', function() {
      assert.equal(binding.CheckDisplayInclude(), true)
    })
  })
})
