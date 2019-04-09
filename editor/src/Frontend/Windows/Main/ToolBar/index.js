import React from 'react'
import styles from './index.module.css'
import { Button } from '../../../Material/Button'

export default class ToolBar extends React.Component {
  render() {
    return (
      <div className={styles.ToolBar}>
        <Button props={['flat', 'icon']}>
          <span className='mdi mdi-content-save-outline' />
        </Button>
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
