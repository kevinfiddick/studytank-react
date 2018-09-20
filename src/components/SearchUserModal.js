/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import ax from './api';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import './FilterList.css';
import Typography from '@material-ui/core/Typography';
import Fuse from 'fuse.js';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';

export default class SearchUserModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      email: '',
      modal: false,
      search: '',
      members: [],
      users: [],
      suggested: [],
      selected: []
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
    this.setState({ search: search });
    var options = {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 3,
      keys: [
        "email",
        "firstname",
        "lastname",
        "username"
      ]
    };
    var fuse = new Fuse(this.state.users, options); // "list" is the item array
    var suggested = fuse.search(search);
    this.setState({ suggested: suggested });
  }

  componentDidMount(){
    let that = this;
    var email = localStorage.getItem('email');
    this.setState({email: email});
    var members = this.props.members.map(a => a.email);
    this.setState({members: members});
    ax.get('/user/_design/user/_view/name')
    .then((result) => {
      var users = [];
      for(var i = 0; i < result.data.rows.length; i++){
        var row = result.data.rows[i];
        var user = row.value;
        if(!members.includes(user.email)){
          var fullname = user.firstname + ' ' + user.lastname;
          var initials = fullname.match(/\b\w/g) || [];
          initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
          user.initials = initials;
          users.push(user);
        }
      }
      that.setState({users: users});
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
            <Typography>Search for users by email, name, or username.</Typography>
            <Typography>Go to your Profile Settings to verify your username.</Typography>
            <TextField
              id="userInput"
              label="Search for Users"
              type="search"
              margin="normal"
              className="filter"
              onChange={this.onSearch.bind(this)}
              fullWidth
              autoComplete='off'
              value={this.state.search}
            />
          {this.state.selected.map((selected, i) =>
            <span key={selected.email}>
              <Chip
                className='chip'
                avatar={<Avatar>{selected.initials}</Avatar>}
                label={selected.username}
                onDelete={(e) => {
                  var selected = this.state.selected;
                  selected.splice(i, 1);
                  this.setState({ selected : selected });
                }}
                color="primary"
              />
            {' '}
            </span>
          )}

            <List>
          {this.state.suggested.map(suggestion =>
              <div key={suggestion.email}>
            <ListItem
            button
            onClick={(e) => {
              var selected = this.state.selected;
              selected.push(suggestion)
              this.setState({ selected : selected });
              this.setState({ search : '' });
              this.setState({ suggested : [] });
            }}
            value={suggestion.email}
            >
               <Avatar>
                 {suggestion.initials}
               </Avatar>
               <ListItemText primary={suggestion.firstname + ' ' + suggestion.lastname} secondary={suggestion.identifier} />
            </ListItem>
             <li>
               <Divider inset />
             </li>
              </div>
            )}
          </List>
          </ModalBody>
          <ModalFooter>
            <Button color="default" onClick={this.toggle}>Cancel</Button>
            {this.state.selected.length > 0 && <Button variant='contained' color="primary"
              onClick={(e) => {
                var invite = this.state.selected.map(a => a.email);
                var fullname = localStorage.getItem('firstname') + ' ' + localStorage.getItem('lastname');
                //Add user to invited list on group page
                let that = this;
                ax.get('/' + 'group' + '/' + this.props.id )
                .then(res => {
                  var group = res.data;
                  that.setState({title: group.title});
                  !group.invited ? group.invited = invite : group.invited.concat(invite);
                  ax({
                    method: 'post',
                    url: '/group',
                    data: {
                      _id: group._id,
                      _rev: group._rev,
                      title: group.title,
                      subject: group.subject,
                      school: group.school,
                      members: group.members,
                      followers: group.followers,
                      invited: group.invited
                    }
                  }).then(result => {
               		 var i = 0;
               		 var recursiveNotify = () => {
               			if(i < invite.length) {
                      ax.get('/' + 'user' + '/' + invite[i] )
                      .then(rs => {
                        var user = rs.data;
                        if(!user.hasOwnProperty('username')){
                          user.username =
                            user.firstname.trim().replace(/\s/g,'-').toLowerCase() + '-' + user.lastname.trim().replace(/\s/g,'-').toLowerCase();
                        }
                        user.notifications.push({
                          id: Date.now(),
                          seen: false,
                          page: "group",
                          linkID: that.props.id,
                          phrase: fullname + ' invited you to join ' + that.state.title
                        });
                        ax({
                          method: 'post',
                          url: '/user',
                          data: {
                            _id: user._id,
                            _rev: user._rev,
                            email: user.email,
                            username: user.username,
                            password: user.password,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            school: user.school,
                            notifications: user.notifications
                          }
                        }).then(r => {
            							i++;
            							recursiveNotify();
                        });
                      });
                    }else{that.setState({modal: false});}
                  }
                  recursiveNotify();
                  });
                });
              }}>Invite</Button>}
          </ModalFooter>
        </form>
        </Modal>
      </span>
    );
  }
}
