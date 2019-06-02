const {
  Test_GlfwInit,
  Test_GlfwIncluded,
  Test_GladIncluded,
  GlfwGetVersion
} = require('../lib/binding.js')
const assert = require('assert')

describe('Kepler Display', function() {
  describe('GLAD', function() {
    it('should be included', function() {
      assert.equal(Test_GladIncluded(), true)
    })
  })
  describe('GLFW', function() {
    it('should be included', function() {
      assert.equal(Test_GlfwIncluded(), true)
    })
    it('should have a version', function() {
      assert.ok(GlfwGetVersion(), true)
    })
  })
})
