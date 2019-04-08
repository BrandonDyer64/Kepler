import React from 'react'

class SnackBarChannel {
  constructor() {
    this.subscriber = null
  }
  subscribe(object) {
    this.subscriber = object
  }
  open(data) {
    this.subscriber.message(data)
  }
}

const snackBarChannel = new SnackBarChannel()

window.snackBarChannel = snackBarChannel

export { snackBarChannel }

export default class SnackBar extends React.Component {
  constructor(props) {
    super(props)
    snackBarChannel.subscribe(this)
  }
  message(data) {
    var snackbarContainer = document.querySelector('#snackbar')
    var finalData = {
      message: data.message || '---',
      timeout: data.timeout || 2000,
      actionHandler: data.onClick || null,
      actionText: data.actionText || null
    }
    snackbarContainer.MaterialSnackbar.showSnackbar(finalData)
  }
  render() {
    return (
      <div id='snackbar' className='mdl-js-snackbar mdl-snackbar'>
        <div className='mdl-snackbar__text' />
        <button className='mdl-snackbar__action' type='button' />
      </div>
    )
  }
}
