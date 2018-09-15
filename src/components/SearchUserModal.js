/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import './FilterList.css';
import Typography from '@material-ui/core/Typography';

class SearchUserModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      suggested: {}
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  onSearch(e){
    var search = e.target.value.toLowerCase();
    var email = localStorage.getItem('email');
    ax.get('/user/_design/user/_view/name')
    .then((result) => {
      console.log(result);
      var suggested = {};
      for(var i = 0; i < result.data.rows.length; i++){
        var row = result.data.rows[i];
        if(!suggested.hasOwnProperty(row.id) && row.id != email){
          if(row.key.search(search) >= 0){
              suggested[row.id] = row.value;
              var initials = row.value[0].match(/\b\w/g) || [];
              initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
              suggested[row.id][2] = initials;
          }

        }
      }
      this.setState({suggested: suggested});
    });
  }

  render() {
    return (
      <span>
        <span onClick={this.toggle}>{this.props.children}</span>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <form onSubmit={this.props.onClick}>
          <ModalHeader toggle={this.toggle}>Add Members To Group</ModalHeader>
          <ModalBody>
            <TextField
              id="userInput"
              label="Search for Users"
              type="search"
              margin="normal"
              className="filter"
              onChange={this.onSearch.bind(this)}
              fullWidth
              autoComplete='off'
            />
          {this.state.suggested.map(suggestion =>
              <div key={suggestion[1]}>
                <Avatar>{suggestion[2]}</Avatar>
                <Typography>{suggestion[0]}</Typography>
                <Typography variant="caption">{suggestion[1]}</Typography>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="default" onClick={this.toggle}>Cancel</Button>
            <Button color="primary" type="submit">{this.props.confirm}</Button>
          </ModalFooter>
        </form>
        </Modal>
      </span>
    );
  }
}

export default ConfirmationModal;
