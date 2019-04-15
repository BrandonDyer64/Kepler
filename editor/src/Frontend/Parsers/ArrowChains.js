export default function parseArrowChains(source) {
  let notSource
  notSource = ''
  while (source != notSource) {
    notSource = source
    source = source.replace(/\((.*?)\)[ \s]*\-\>(.*?)\n/i, (match, a1, a2) => {
      if (a2.includes('(')) {
        return `(${a2.replace(/_(.[,)]?)/, a1 + '$1')}\n`
      } else {
        return `(${a2}(${a1}))\n`
      }
    })
    console.log(notSource)
  }
  notSource = ''
  while (source != notSource) {
    notSource = source
    source = source.replace(/\((.*?)\)[ \s]*\-\>(.*?)\n/i, '($2($1))\n')
    console.log(notSource)
  }
  return source
}
