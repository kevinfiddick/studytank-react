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

export default class AddAdminModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      email: '',
      modal: false,
      search: '',
      admins: [],
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
    var email = localStorage.getItem('email');
    this.setState({email: email});

    let that = this;
    if(localStorage.getItem('firstname') == '' || localStorage.getItem('firstname') == null ){
        ax.get('/user/' + email)
          .then((result) => {
              const user = result.data;
              if (user.password === localStorage.getItem('password')) {
                localStorage.setItem('email', user.email);
                localStorage.setItem('firstname', user.firstname);
                localStorage.setItem('lastname', user.lastname);
                localStorage.setItem('school', user.school);
                if(!user.hasOwnProperty('username')){
                  user.username =
                    user.firstname.trim().replace(/\s/g,'-').toLowerCase() + '-' + user.lastname.trim().replace(/\s/g,'-').toLowerCase();
                }
                localStorage.setItem('username', user.username);

                const MONTH_IN_MS = 2678400000;
                var grace = 3 * MONTH_IN_MS;
                localStorage.setItem('expires', Date.now() + grace);

              }
              else{
                localStorage.clear();
              }
            });
    }

    var admins = this.props.admins.map(a => a.email);
    this.setState({admins: admins});
    ax.get('/user/_design/user/_view/name')
    .then((result) => {
      var users = [];
      for(var i = 0; i < result.data.rows.length; i++){
        var row = result.data.rows[i];
        var user = row.value;
        if(!admins.includes(user.email)){
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
          <ModalHeader toggle={this.toggle}>Add Admins to Course</ModalHeader>
          <ModalBody>
            <Typography>Search for users by email, name, or username.</Typography>
            <Typography>Your Username can be found in Profile Settings</Typography>
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
                var admins = [];
                for(var i = 0; i < this.state.selected.length; i++){
                  var admin = this.state.selected[i];
                  delete admin.username;
                  delete admin.identifier;
                  admins.push(admin);
                }
                var fullname = localStorage.getItem('firstname') + ' ' + localStorage.getItem('lastname');
                //Add user to admins of course page
                let that = this;
                ax.get('/' + 'course' + '/' + this.props.id )
                .then(res => {
                  var course = res.data;
                  that.setState({title: course.title});
                  !course.admins ? course.admins = admins : course.admins = course.admins.concat(admins);
                  ax({
                    method: 'post',
                    url: '/course',
                    data: {
                      _id: course._id,
                      _rev: course._rev,
                      title: course.title,
                      course: course.course,
                      school: course.school,
                      professor: course.professor,
                      admins: course.admins,
                      students: course.students,
                      invited: course.invited,
                      outcomes: course.outcomes
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
                          page: "course",
                          linkID: that.props.id,
                          phrase: 'You are now an Admin of the following course: ' + that.state.title
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
                    }else{window.location.reload();}
                  }
                  recursiveNotify();
                  });
                });
              }}>Add Admins</Button>}
          </ModalFooter>
        </form>
        </Modal>
      </span>
    );
  }
}
