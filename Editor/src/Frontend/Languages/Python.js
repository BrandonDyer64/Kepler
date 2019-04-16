import coffeeScript from './CoffeeScript'
import python2coffee from '../Parsers/Python2Coffee'

export default {
  extensionsIn: ['py'],
  extensionOut: 'js',
  parsers: [python2coffee, ...coffeeScript.parsers]
}
