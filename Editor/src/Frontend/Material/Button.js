import React from 'react'
import cx from 'classnames'
import gtk from '../gtk'

export function Button(props) {
  return (
    <button
      onClick={props.onClick}
      id={props.id}
      className={cx(
        'mdl-button',
        'mdl-js-button',
        'mdl-js-ripple-effect',
        props.props.map(value => {
          return 'mdl-button--' + value
        })
      )}
      style={props.nogtk ? {} : gtk.button}
    >
      {props.title || props.children}
    </button>
  )
}
