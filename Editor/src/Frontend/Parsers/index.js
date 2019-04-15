import languages from '../Languages'

export default {
  parse(extension, source) {
    // Get language from extension
    const filteredLanguages = languages.filter(lang =>
      lang.extensionsIn.contains(extension)
    )
    if (filteredLanguages.length < 1) return null
    const language = filteredLanguages

    // Apply languages parsers
    const parsers = language.parsers
    parsers.forEach(parser => (source = parser(source)))

    return {
      source,
      extension: language.extensionOut
    }
  }
}
