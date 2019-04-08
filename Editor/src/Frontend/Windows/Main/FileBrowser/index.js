import React from 'react'
import styles from './index.module.css'
import Item from './Item'

const remote = window.require('electron').remote
const fs = remote.require('fs')

export default props => (
  <div className={styles.FileBrowser}>
    <div className={styles.fileList}>
      <Item
        title='My Project'
        icon='folder'
        path={props.path}
        onPathLoad={props.onPathLoad}
        open={true}
      />
    </div>
  </div>
)
