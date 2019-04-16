import CoffeeScript from 'coffeescript'

export default {
  name: 'Coffee2JS',
  parse(source) {
    return CoffeeScript.compile(source, {inlineMap: true, bare: true, header: true})
  }
}
