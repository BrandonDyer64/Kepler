const electron = window.require('electron')
const remote = electron.remote
const fs = remote.require('fs')
const gtk = remote.require('./gtk')

export default gtk
