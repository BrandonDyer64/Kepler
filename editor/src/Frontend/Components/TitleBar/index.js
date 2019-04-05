import React from 'react'
import './index.css'

const electron = window.require('electron')
const fs = electron.remote.require('fs')
const currentWindow = electron.remote.getCurrentWindow()

export default class TitleBar extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className='TitleBar'>
        <div className='content'>{this.props.children}</div>
        <div className='buttons'>
          <span
            class='mdi mdi-window-minimize'
            onClick={() => currentWindow.minimize()}
          />
          <span
            class='mdi mdi-window-maximize'
            onClick={() => currentWindow.maximize()}
          />
          <span
            class='mdi mdi-window-close'
            onClick={() => currentWindow.close()}
          />
        </div>
      </div>
    )
  }
}
