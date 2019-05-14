const {
  Test_GlfwInit,
  Test_GlfwIncluded,
  Test_GladIncluded,
  GlfwGetVersion
} = require('../lib/binding.js')
const assert = require('assert')

console.log(GlfwGetVersion())

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
    it('should initialize', function() {
      assert.equal(Test_GlfwInit(), true)
    })
  })
})
