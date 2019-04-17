import languages from '../Languages'

export default {
  parse(extension, source, data = {}) {
    // Get language from extension
    const filteredLanguages = languages.filter(lang =>
      lang.extensionsIn.includes(extension)
    )
    if (filteredLanguages.length < 1) return null
    const language = filteredLanguages[0]

    // Apply languages parsers
    const parsers = language.parsers
    parsers.forEach(parser => {
      source = parser.parse(source, data)
    })

    return {
      success: true,
      source,
      extension: language.extensionOut
    }
  }
}
