/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import equal from 'fast-deep-equal';

class ConfirmationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      disabled: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    if(!this.state.disabled){
      this.setState({
        modal: !this.state.modal
      });
    }
    else{
      this.setState({
        modal: false
      });
    }
  }

  componentWillMount() {

    this.setState({
      disabled: this.props.disabled || false
    });
  }

  onSubmit(e){
      e.preventDefault();
      this.props.onClick(e);
      this.setState({
        modal: false
      });
  }

  componentDidUpdate(prevProps) {
    if(!equal(this.props.disabled, prevProps.disabled)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
    {

      this.setState({
        disabled: this.props.disabled || false
      });
    }

}

  render() {
    return (
      <span style={{zIndex:5}}>
        <span onClick={this.toggle}>{this.props.children}</span>
      {!this.state.disabled &&
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <form onSubmit={this.onSubmit.bind(this)}>
          <ModalHeader toggle={this.toggle}>{this.props.modalHeader}</ModalHeader>
          <ModalBody>
          {this.props.message}
          </ModalBody>
          <ModalFooter>
            <Button color="default" onClick={this.toggle}>Cancel</Button>
            <Button  variant='contained' color="primary" type="submit">{this.props.confirm}</Button>
          </ModalFooter>
        </form>
      </Modal>}
      </span>
    );
  }
}

export default ConfirmationModal;
