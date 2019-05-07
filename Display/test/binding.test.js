const { KeplerEntities, KeplerEntities2 } = require('../lib/binding.js')
const assert = require('assert')

describe('Kepler Display', function() {
  describe('Hello, World!', function() {
    it('should return world', function() {
      assert.equal(KeplerEntities(), 'world')
    })
    it('should return world2', function() {
      assert.equal(KeplerEntities2(), 'world2')
    })
  })
})
