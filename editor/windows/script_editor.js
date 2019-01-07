const electron = require('electron')
const fs = require('fs')
const remote = electron.remote
const currentWindow = remote.getCurrentWindow()
const path = require('path')
const prettier = require('prettier')
const LuaPlugin = require('@prettier/plugin-lua')

const config = require(currentWindow.custom.path)
console.log(config.type)
const filepath = currentWindow.custom.path.split('.')[0] + '.' + config.type
const filename = path.basename(currentWindow.custom.path.split('.')[0])
document.getElementById('editor-name').innerHTML = filename
let content
if (fs.existsSync(filepath)) {
  content = fs.readFileSync(filepath, 'utf8')
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
editor.setValue(content)
editor.focus()
function save() {
  const unformatted = editor.getValue()
  const formatted =
    config.type != 'lua'
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
  fs.writeFile(filepath, formatted, 'utf8', err => {
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
