import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText } from 'reactstrap'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'

class ModalExample extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      modal: false
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle () {
    this.setState({
      modal: !this.state.modal
    })
  }

  render () {
    return (
      <div>
        <Button color='primary' onClick={this.toggle}>Next</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Finish Uploading Note</ModalHeader>
          <ModalBody>
          Please Finalize your note with the following fields:
            <Tooltip title='Examples: MA262, Calculus, Sports Statistics' placement='right'>
              <TextField
                required
                id='subject'
                onChange={this.onChange}
                label='Subject'
                className='textField'
                margin='normal'
              />
            </Tooltip>

            <Tooltip title='Example: Milwaukee School Of Engineering ' placement='right'>
              <TextField
                required
                id='school'
                onChange={this.onChange}
                label='School/University'
                className='textField'
                margin='normal'
              />
            </Tooltip>
            <TextField
              required
              id='references'
              onChange={this.onChange}
              label='References/'
              className='textField'
              margin='normal'
            />
            <br />
            <br />
            <p>Fact or Opinion:</p>
            <FormGroup>
              <Input type='select' name='select' id='exampleSelect'>
                <option>Fact</option>
                <option>Opinion</option>
              </Input>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button type='submit' color='primary' onClick={this.toggle}>Submit</Button>{' '}
            <Button color='secondary' onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default ModalExample
