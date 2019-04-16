export default {
  name: 'ArrowChains',
  parse(source) {
    let notSource = ''
    let i = 0

    while (source != notSource && i++ < 15) {
      notSource = source
      source = source.replace(/\n[\s]*(.*?)\n[\s]*(->|\.)(.*?)\n/i, (match, a1, a2, a3) => {
        if (a2 == '->') {
          if (a3.includes('(')) {
            return `\n${a3.replace(/_(.[,)]?)/, a1 + '$1')}\n`
          } else {
            return `\n${a3}(${a1})\n`
          }
        } else {
          return `\n${a1}.${a3}\n`
        }
      })
      console.log(notSource)
    }
    return source
  }
}
