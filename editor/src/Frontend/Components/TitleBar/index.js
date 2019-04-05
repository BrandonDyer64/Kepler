import React from 'react'
import './index.css'

const electron = window.require('electron')
const currentWindow = electron.remote.getCurrentWindow()

export default class TitleBar extends React.Component {
  constructor(props) {
    super(props)
    currentWindow.on('unmaximize', () => this.setState({ isMaximized: false }))
    currentWindow.on('maximize', () => this.setState({ isMaximized: true }))
    this.state = { isMaximized: false }
  }
  render() {
    return (
      <div className='TitleBar'>
        <div className='content'>{this.props.children}</div>
        <div className='buttons'>
          <span
            className='mdi mdi-lightbulb-on light-button'
            onClick={() => this.props.onLightToggle()}
          />
          <span
            className='mdi mdi-window-minimize'
            onClick={() => currentWindow.minimize()}
          />
          <span
            className={
              'mdi mdi-window-' +
              (this.state.isMaximized ? 'restore' : 'maximize')
            }
            onClick={() => {
              if (!this.state.isMaximized) {
                currentWindow.maximize()
              } else {
                currentWindow.restore()
              }
              this.setState(s => ({ isMaximized: !s.isMaximized }))
            }}
          />
          <span
            className='mdi mdi-window-close'
            onClick={() => currentWindow.close()}
          />
        </div>
      </div>
    )
  }
}
