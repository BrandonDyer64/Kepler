import React from 'react'
import styles from './index.module.css'
import { Button } from '../../../Material/Button'
import idmk from '../../../Utils/Id.js'

export default class ToolBar extends React.Component {
  render() {
    const id = idmk()
    return (
      <div className={styles.ToolBar}>
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
        <Button props={['flat', 'icon']}>
          <span className='mdi mdi-source-fork' />
        </Button>
        <Button props={['flat', 'icon']}>
          <span className='mdi mdi-tune' />
        </Button>
        <Button props={['flat', 'icon']}>
          <span className='mdi mdi-console' />
        </Button>
        <Button props={['flat', 'icon']}>
          <span className='mdi mdi-package-variant-closed' />
        </Button>
        <Button props={['flat', 'icon']}>
          <span className='mdi mdi-lan-connect' />
        </Button>
        <Button props={['flat', 'icon']}>
          <span className='mdi mdi-play-circle-outline' />
        </Button>
        <Button props={['flat', 'icon']}>
          <span className='mdi mdi-cast' />
        </Button>
      </div>
    )
  }
}
