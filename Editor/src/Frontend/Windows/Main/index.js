import React from 'react'
import './index.css'
import BottomBar from '../../Components/BottomBar'

export default class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className='Main'>
        <div className='content'>Content</div>
        <BottomBar />
      </div>
    )
  }
}
