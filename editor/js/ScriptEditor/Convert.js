const esperanto = require('./Esperanto')

function convert(type, source) {
  // Pad source string
  source = ` ${source} `

  // Esperanto
  source = esperanto(source)

  return source.trim()
}

module.exports = convert
