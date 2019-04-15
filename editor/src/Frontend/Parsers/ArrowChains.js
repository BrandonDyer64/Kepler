export default function parseArrowChains(source) {
  let notSource
  notSource = ''
  let i = 0
  while (source != notSource && i++ < 15) {
    notSource = source
    source = source.replace(/\((.*?)\)[ \s]*(\-\>|\.)(.*?)\n/i, (match, a1, a2, a3) => {
      if (a2 == '->') {
        if (a3.includes('(')) {
          return `(${a3.replace(/_(.[,)]?)/, a1 + '$1')})\n`
        } else {
          return `(${a3}(${a1}))\n`
        }
      } else {
        return `((${a1})/**/.${a3})\n`
      }
    })
    console.log(notSource)
  }
  return source
}
