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
      return (
        <>
          <Button props={['flat', 'icon']} id={id('save')}>
            <span className='mdi mdi-content-save-outline' />
          </Button>
          <ul
            class='mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect'
            for={id('save')}
          >
            <li class='mdl-menu__item'>Some Action</li>
            <li class='mdl-menu__item mdl-menu__item--full-bleed-divider'>
              Another Action
            </li>
            <li disabled class='mdl-menu__item'>
              Disabled Action
            </li>
            <li class='mdl-menu__item'>Yet Another Action</li>
          </ul>
        </>
      )
    })
    return <div className={styles.ToolBar}>{buttons}</div>
  }
}
