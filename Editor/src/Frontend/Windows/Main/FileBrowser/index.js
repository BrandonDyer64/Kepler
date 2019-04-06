import React from 'react'
import styles from './index.module.css'
import Item from './Item'

export default class FileBrowser extends React.Component {
  render() {
    return (
      <div className={styles.FileBrowser}>
        <div className={styles.fileList}>
          <Item title='My Project' icon='folder'>
            <Item title='Scripts' icon='folder'>
              <Item title='Test' icon='cube-send' active />
              <Item title='Test' icon='cube-send' />
            </Item>
            <Item title='Materials' icon='folder'>
              <Item title='Test' icon='format-color-fill' />
              <Item title='Test' icon='format-color-fill' />
            </Item>
            <Item title='Models' icon='folder'>
              <Item title='Test' icon='vector-polygon' />
              <Item title='Test' icon='vector-polygon' />
            </Item>
          </Item>
        </div>
      </div>
    )
  }
}
