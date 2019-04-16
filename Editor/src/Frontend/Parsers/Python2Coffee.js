export default {
  name: 'Python2Coffee',
  parse(source) {
    // Extract strings
    const strs = []
    source = source.replace(/(["'])(?:(?=(\\?))\2.)*?\1/gi, (m, _, _1, a1, a2) => {
      strs.push(m)
      return `%String[${strs.length}]%`
    })

    // Functions
    source = source.replace(/([^a-zA-Z0-9])class (.*?)\sdef (.*?)\((.*?)\):/g, '$1class $2$3$4: ($5) ->')
    source = source.replace(/([^a-zA-Z0-9])def (.*?)\((.*?)\)\:/g, '$1$2 = ($3) ->')
    source = source.replace(/([^a-zA-Z0-9])lambda (.*?):/g, '$1($2) ->')

    // Switch
    source = source.replace(/([^a-zA-Z0-9])while switch\((.*?)\):/g, '$1switch $2:')
    source = source.replace(/([^a-zA-Z0-9])for case in switch\((.*?)\):/g, '$1switch $2:')
    source = source.replace(/([^a-zA-Z0-9])if case\((.*?)\)[\s]*:[ \t]+(.*?)\n+/g, '$1when $2 then $3\n')
    source = source.replace(/([^a-zA-Z0-9])if case\((.*?)\)[\s]*:\n+/g, '$1when $2\n')

    // Spacing
    source = source.replace(':\n', '\n')

    // Add strings
    strs.forEach((str,i) => (source = source.replace(`%String[${i+1}]%`,`${str}`)))
    console.log(source)

    return source
  }
}
