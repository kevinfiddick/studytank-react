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
import { sha256 } from './Encoder';
import email from 'emailjs';

export default class AddStudentsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      professor: '',
      email: '',
      modal: false,
      selected: [],
      students: [],
      users: []
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  onUserInput(e){
    var userInput = e.target.value.toLowerCase();
    var userArray = userInput.replace(/\n/g, ",").replace(/\r/g, ",").split(/[\s,]+/);
    this.setState({ students: userArray });

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

    var students = this.props.students.map(a => a.email);
    this.setState({students: students});
    ax.get('/user/_design/user/_view/name')
    .then((result) => {
      var users = [];
      for(var i = 0; i < result.data.rows.length; i++){
        var row = result.data.rows[i];
        var user = row.value;
        if(!students.includes(user.email)){
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
          <ModalHeader toggle={this.toggle}>Add Students to Course</ModalHeader>
          <ModalBody>
            <Typography>Enter an Email List of Students to add to the Course.</Typography>
            <Typography>Seperate emails by comma, spaces, or seperate lines.</Typography>
            <TextField
              id="userInput"
              label="Email List"
              multiline
              margin="normal"
              className="filter"
              onChange={this.onUserInput.bind(this)}
              fullWidth
              autoComplete='off'
              value={this.state.userInput}
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

          </ModalBody>
          <ModalFooter>
            <Button color="default" onClick={this.toggle}>Cancel</Button>
            {this.state.students.length > 0 && <Button variant='contained' color="primary"
              onClick={(e) => {
                var emails = this.state.students;
                var students = [];
                var invited = [];
                //Add user to students of course page
                let that = this;

                ax.get('/' + 'course' + '/' + this.props.id )
                .then(res => {
                  var course = res.data;
                  that.setState({title: course.title});
                  that.setState({professor: course.professor});
                  !course.students ? course.students = students : course.students = course.students.concat(students);
                  !course.invited ? course.invited = invited : course.invited = course.invited.concat(invited);
               		 var i = 0;
               		 var recursiveNotify = () => {
               			if(i < emails.length) {
                      var check = course.students.map(a => a.email);
                      if(!check.includes(emails[i])){
                      ax.get('/' + 'user' + '/' + emails[i] )
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
                          phrase: 'You have been added to the following course: ' + course.title
                        });
                        course.students.push({
                          email: user.email,
                          firstname: user.firstname,
                          lastname: user.lastname
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
                      })
                      .catch(er => {
                        if(emails[i] != '' && emails[i] != null){
                          const unique = sha256("email:"+emails[i]);
                          unique.then(function(value){
                            
                            var server 	= email.server.connect({
                              user:    "kevinfiddick",
                              password:"egoFriendly123",
                              host:    "smtp.zoho.com",
                              ssl:     true
                            });

                            // send the message and get a callback with an error or details of the message that was sent
                            server.send({
                              text:    "View Class Material, Filter Notes by Course Outcomes, and Share Your Notes with Classmates today!\n\n" +
                              "We already filled out most of the registration for you! \n"+
                              "Finish Registeration Here: https://www.studytank.com/quickreg/" + value ,
                              from:    "StudyTank <kevinfiddick@studytank.com>",
                              to:      " <"+emails[i]+">",
                              subject: "You have been enrolled in " + course.title + " on StudyTank.com"
                            }, function(err, message) { console.log(err || message); });
                            

                            var test = course.invited.map(a => a.email);
                            !test.includes(emails[i]) ? course.invited.push({id: value, email: emails[i]}) : null;
                            i++;
                            recursiveNotify();
                          });
                        }
                      });
                    }else{
                      i++;
                      recursiveNotify();
                    }}else{
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
                          window.location.reload();
                        });
                      }
                  }
                  recursiveNotify();
                });
              }}>Finish</Button>}
          </ModalFooter>
        </form>
        </Modal>
      </span>
    );
  }
}
