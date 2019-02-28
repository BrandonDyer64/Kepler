function replaceNoString(haystack, needle, replacement) {
  const regex = new RegExp(
    `"[^"]+"|((^|[^a-zA-Z0-9])${needle}(?![a-zA-Z0-9]))`,
    'g'
  )
  return haystack.replace(regex, (m, group1) => {
    return !group1 ? m : m[0] + replacement
  })
}

function esperanto(s) {
  if (!s.trim().startsWith('//* eo')) return s

  const replacements = [
    // Preprocessor
    ['#inkluzivu', '#include'],

    // Keywords
    ['alie', 'else'],
    ['buleo', 'bool'],
    ['cxeno', 'string'],
    ['klaso', 'class'],
    ['loka', 'local'],
    ['nova', 'new'],
    ['se', 'if'],
    ['vako', 'void']
  ]

  for (let i in replacements) {
    const replacement = replacements[i]
    s = replaceNoString(s, replacement[0], replacement[1])
  }
  return s
}

module.exports = esperanto
