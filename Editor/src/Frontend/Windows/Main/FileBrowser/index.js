import React from 'react'
import styles from './index.module.css'
import Item from './Item'

const remote = window.require('electron').remote
const fs = remote.require('fs')

export default class FileBrowser extends React.Component {
  render() {
    return (
      <div className={styles.FileBrowser}>
        <div className={styles.fileList}>
          <Item
            title='My Project'
            icon='folder'
            path={this.props.path}
            onPathLoad={this.props.onPathLoad}
            open={true}
          />
        </div>
      </div>
    )
  }
}
