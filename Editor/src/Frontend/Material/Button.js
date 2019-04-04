import React from 'react'

export function Button(props) {
  return (
    <button
      onClick={props.onClick}
      id={props.id}
      className={
        'mdl-button mdl-js-button mdl-js-ripple-effect ' +
        props.props
          .map(value => {
            return 'mdl-button--' + value
          })
          .join(' ')
      }
    >
      {props.title || props.children}
    </button>
  )
}
