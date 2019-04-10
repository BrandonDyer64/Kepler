import React from 'react'
import styles from './index.module.css'
import { Button } from '../../../Material/Button'
import idmk from '../../../Utils/Id.js'
import toolBarApi from './api'

export { toolBarApi }

export default class ToolBar extends React.Component {
  constructor() {
    super()
    toolBarApi.subscribe(this)
    this.state = {
      buttons: toolBarApi.buttons
    }
  }

  updateButtons(buttons) {
    this.setState({ buttons })
  }

  render() {
    const id = idmk(this)
    const buttons = this.state.buttons.map((button, i) => {
      const itemKey = idmk(button)
      return (
        <>
          <Button
            props={['flat', 'icon']}
            id={id(button.name)}
            key={`${id(button.name)}-${i}`}
            onClick={button.onClick || (() => {})}
          >
            <span className={'mdi mdi-' + button.icon} />
          </Button>
          {!!button.menu && (
            <ul
              className='mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect'
              htmlFor={id(button.name)}
            >
              {button.menu.map(item => (
                <li
                  className='mdl-menu__item'
                  onClick={item.onClick}
                  key={itemKey(item.name)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </>
      )
    })
    return <div className={styles.ToolBar}>{buttons}</div>
  }
}
