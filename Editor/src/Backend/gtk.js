const { theme } = require('@jakejarrett/gtk-theme')
const nativeCSS = require('native-css')
const converted = nativeCSS.convert(theme.css)
module.exports = converted
