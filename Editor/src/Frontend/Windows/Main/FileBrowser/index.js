import React from 'react'
import styles from './index.module.css'
import Item from './Item'

export default class FileBrowser extends React.Component {
  render() {
    return (
      <div className={styles.FileBrowser}>
        <div className={styles.fileList}>
          <Item title='title' icon='folder'>
            <Item title='test' icon='language-javascript' active />
            <Item title='test' icon='language-javascript' />
            <Item title='test' icon='language-javascript' />
            <Item title='test' icon='folder'>
              <Item title='test' icon='language-javascript' active />
              <Item title='test' icon='language-javascript' />
              <Item title='test' icon='language-javascript' />
            </Item>
            <Item title='test' icon='language-javascript' />
          </Item>
        </div>
      </div>
    )
  }
}
