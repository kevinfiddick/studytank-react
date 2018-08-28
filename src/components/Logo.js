import React from 'react'
import {Row, Col} from 'reactstrap'

const container = {
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%'
}

export default class Logo extends React.Component {
  render () {
    return (
      <Row>
        <Col xs='12'>
          <br />
          <div
            style={container}
          >
            <img
              style={{
                minWidth: '320px',
                maxHeight: '100px'
              }}
              src={require('../fullLogo.svg')}
              alt='StudyTank'
            />
          </div>
          <br />
        </Col>
      </Row>
    )
  }
}
