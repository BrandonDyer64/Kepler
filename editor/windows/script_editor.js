const electron = require('electron')
const fs = require('fs')
const remote = electron.remote
const currentWindow = remote.getCurrentWindow()
const path = require('path')
const prettier = require('prettier')
const LuaPlugin = require('@prettier/plugin-lua')
const convert = require('../js/ScriptEditor/Convert')

const config = require(currentWindow.custom.path)
console.log(config.type)
const sourcepath = currentWindow.custom.path.split('.')[0] + '.source'
const outpath = currentWindow.custom.path.split('.')[0] + '.' + config.type
const filename =
  path.basename(currentWindow.custom.path.split('.')[0]) + '.' + config.type
document.getElementById('editor-name').innerHTML = filename
let content
if (fs.existsSync(sourcepath)) {
  content = fs.readFileSync(sourcepath, 'utf8')
} else {
  content = 'function Create()\nend\n\nfunction Tick(delta)\nend'
}
var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true,
  mode: { lua: 'lua', as: 'as', cpp: 'text/x-c++src' }[config.type],
  keyMap: 'sublime',
  theme: 'material'
})
if (config.type != 'as') {
  document.getElementsByClassName('CodeMirror')[0].style.fontWeight = 'bold'
}
if (config.type != 'cpp') {
  document.getElementsByClassName('CodeMirror')[0].style.fontFamily =
    'fantasque'
}
editor.setValue(content)
editor.focus()
function save() {
  const unformatted = editor.getValue()
  const formatted =
    config.type != 'lua' || !unformatted.startsWith('--* eo')
      ? unformatted
      : prettier.format(unformatted, {
          singleQuote: false,
          semi: true,
          tabWidth: 2,
          useTabs: false,
          bracketSpacing: true,
          parser: 'lua',
          pluginSearchDirs: ['../'],
          plugins: ['@prettier/plugin-lua']
        }) + '\n'
  if (unformatted != formatted) {
    const cursor = editor.getCursor()
    editor.setValue(formatted)
    editor.setCursor(cursor)
  }
  fs.writeFile(sourcepath, formatted, 'utf8', err => {
    if (err) {
      console.error(err)
      return
    }
  })
  const converted = convert(config.type, formatted)
  fs.writeFile(outpath, converted, 'utf8', err => {
    if (err) {
      console.error(err)
      return
    }
    document.getElementById('editor-name').innerHTML = filename
  })
}
editor.setOption('extraKeys', {
  Tab: function(cm) {
    var spaces = Array(cm.getOption('indentUnit') + 1).join(' ')
    cm.replaceSelection(spaces)
  },
  'Ctrl-S': cm => {
    save()
  },
  'Ctrl-Mousewheelup': cm => {
    console.log('mouse wheel up')
  }
})
editor.on('change', () => {
  document.getElementById('editor-name').innerHTML = filename + '*'
})
