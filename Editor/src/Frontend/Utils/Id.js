import _ from 'lodash'

// Returns a function for creating unique IDs in components
export default name => {
  if (typeof name !== 'string') {
    name = name.constructor.name
  }
  const text = _.uniqueId(`${name}_`)
  return id => `${text}_${id}`
}

/*
Example:
idmk = require('Id.js')
id = ldmk(this)
<div id={id('my_div')} />
*/
