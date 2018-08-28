import React, { Component } from 'react'
import ScriptTag from 'react-script-tag'

export default class Payroc extends Component {
  render () {
    return (
      <form>
        <ScriptTag
          isHydrating
          type='text/javascript'
          src='https://js.itransact.com/itransact.js'
          className='itransact-checkoutmodal'
          data-api-username='YOUR_API_USERNAME'
          data-name='iTransact.com'
          data-description='Payment Guide'
          data-amount='1299' />
      </form>)
  }
}
