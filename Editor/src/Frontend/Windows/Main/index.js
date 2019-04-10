import React from 'react'
import './index.css'
import BottomBar from './BottomBar'
import FileBrowser from './FileBrowser'
import ToolBar from './ToolBar'
import Editor from './Editor'

export default class Main extends React.Component {
  render() {
    return (
      <div className='Main'>
        <div className='content'>
          <FileBrowser path='.' />
          <div className='subcontent'>
            <ToolBar />
            <Editor />
          </div>
        </div>
        <BottomBar />
      </div>
    )
  }
}
