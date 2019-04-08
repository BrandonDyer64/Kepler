import React from 'react'
import './index.css'
import BottomBar from './BottomBar'
import FileBrowser from './FileBrowser'
import ToolBar from './ToolBar'

export default class Main extends React.Component {
  render() {
    return (
      <div className='Main'>
        <div className='content'>
          <FileBrowser path='C:/' />
          <div className='subcontent'>
            <ToolBar />
          </div>
        </div>
        <BottomBar />
      </div>
    )
  }
}
