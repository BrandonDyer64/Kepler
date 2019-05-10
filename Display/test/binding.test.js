const { Test_GlfwInit } = require('../lib/binding.js')
const assert = require('assert')

describe('Kepler Display', function() {
  describe('GLFW', function() {
    it('should initialize', function() {
      assert.equal(Test_GlfwInit(), true)
    })
  })
})
