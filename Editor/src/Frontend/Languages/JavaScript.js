import preprocess from '../Parsers/Preprocess'
import arrowChains from '../Parsers/ArrowChains'

export default {
  extensionsIn: ['js'],
  extensionOut: 'js',
  parsers: [preprocess, arrowChains]
}
