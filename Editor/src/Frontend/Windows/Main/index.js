import React from 'react'
import './index.css'
import BottomBar from './BottomBar'
import FileBrowser from './FileBrowser'

export default class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className='Main'>
        <div className='content'>
          <FileBrowser />
          <div>content</div>
        </div>
        <BottomBar />
      </div>
    )
  }
}
