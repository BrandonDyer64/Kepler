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
    const buttons = this.state.buttons.map(button => {
      const menu = (button.menu || []).map(item => (
        <li class='mdl-menu__item' onClick={item.onClick}>
          item.name
        </li>
      ))
      return (
        <>
          <Button props={['flat', 'icon']} id={id(button.name)}>
            <span className='mdi mdi-content-save-outline' />
          </Button>
          {!!button.menu && (
            <ul
              class='mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect'
              for={id(button.name)}
            >
              {menu}
            </ul>
          )}
        </>
      )
    })
    return <div className={styles.ToolBar}>{buttons}</div>
  }
}
