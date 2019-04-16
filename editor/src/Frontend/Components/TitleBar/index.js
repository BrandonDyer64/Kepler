import React from 'react'
import './index.css'
import cx from 'classnames'

const electron = window.require('electron')
const remote = electron.remote
const platform = remote.require('os').platform()
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
      <div className={cx('TitleBar', `p_${platform}`)}>
        <div className='content'>{this.props.children}</div>
        <div className='buttons'>
          {platform !== 'linux' &&
            <span
              className='mdi mdi-lightbulb-on light-button'
              onClick={() => this.props.onLightToggle()}
            />
          }
          {platform === 'win32' && <>
            <div className="separator" />
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
          </>
          }
        </div>
      </div>
    )
  }
}
