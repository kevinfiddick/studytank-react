import React from 'react';
import Button from '@material-ui/core/Button';
import ConfirmationModal from './ConfirmationModal';
import {Container, Row, Col} from "reactstrap";
import GroupPageNoteList from './FilterNoteListGroupPageSel';
import GroupPageNotes from './FilterNoteListGroupPage';
import ax from './api';
import Heading from './Heading';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/AddCircle';
import LeaveIcon from '@material-ui/icons/HighlightOff';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import SearchUserModal from './SearchUserModal';
import './Form.css';
import './Link.css';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import FollowIcon from "@material-ui/icons/PeopleOutline";
import {Alert} from "reactstrap";

const theme = createMuiTheme({
  palette: {
	   primary: {
	     light: '#00796B',
	     main: '#FF6F00',
	     dark: '#E65100',
	     contrastText: '#fff',
	   }
  }
});

const buff = createMuiTheme({
	overrides: {
      MuiButton: {
        root: {
          marginTop: 4,
        }
      }
    }
});

  const button = {
    padding: '11px',
    marginLeft: '15px'
  }

export default class FilterNoteList extends React.Component {
  state = {
    email: '',
    title: '',
    subject: '',
    school: '',
    member: false,
    members: [],
    follower: false,
    followers: [],
    invited: false,
    confirmation: false
  };

  leaveGroup(e) {
    ax.get('/' + 'group' + '/' + this.props.id )
      .then(res => {
        var group = res.data;
        let that = this;
        var members = [];
        for(var i = 0; i < group.members.length; i++){
          var member = group.members[i];
          if(member.email != this.state.email){
            members.push(member);
          }
        }
        group.members = members;
        !group.invited ? group.invited = [this.state.email] : group.invited.push(this.state.email);
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
          that.setState({member: false});
          that.setState({members: group.members});
        });
      })
  }

  componentDidMount() {
    const email = localStorage.getItem('email') || '';
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


    ax.get('/' + 'group' + '/' + this.props.id )
      .then(res => {
          var group = res.data;
          that.setState({ title: group.title });
          that.setState({ subject: group.subject });
          that.setState({ school: group.school });
          that.setState({ followers: group.followers })
          group.followers.includes(email) ? that.setState({ follower: true }) : that.setState({ follower: false });
          if(group.invited){
            group.invited.includes(email) ? that.setState({ invited: true }) : that.setState({ invited: false });
          }
          var members = this.state.members;
          while(group.members.length > 0){
            var member = group.members.pop();
            var name = member.firstname + ' ' + member.lastname;
            var initials = name.match(/\b\w/g) || [];
            initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
            var memberData = {
              fullname: name,
              email: member.email,
              initials: initials
            };
            members.push(memberData);
            member.email == email ? that.setState({member: true}) : null;
          }
          that.setState({members: members});
      });
	}

  render() {
		return(
    <div>
			<MuiThemeProvider theme={theme}>
        <Container>
  			<Row>
  				<Col md={{ size: 8, offset: 2 }} xs={{ size: 12, offset: 0 }}>
            {!this.state.member && this.state.invited && <Row>
      				<Col xs={{ size: 6 }}>
              <Button variant="outlined" fullWidth
							className="darklink" onClick={(e) => {
                this.setState({ invited: false });
              }}>Decline Invite</Button>
              </Col>
      				<Col xs={{ size: 6 }}>
              <Button variant="contained" fullWidth color="primary"
							className="lightlink" onClick={(e) => {
                let that = this;
                ax.get('/' + 'group' + '/' + this.props.id )
                .then(res => {
                  var group = res.data;
                  if(that.state.follower){
                    var i = group.followers.indexOf(that.state.email);
                    group.followers.splice(i, 1);
                  }
                  var i = group.invited.indexOf(that.state.email);
                  group.invited.splice(i, 1);
                  var newMember = {
                    email: that.state.email,
                    firstname: localStorage.getItem('firstname'),
                    lastname: localStorage.getItem('lastname')
                  }
                  group.members.push(newMember);
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
                    if(that.state.follower){
                      var followers = that.state.followers;
                      followers.pop();
                      that.setState({followers: followers});
                      that.setState({follower: false});
                    }
                    that.setState({member: true});
                    var members = that.state.members;
                    var name = localStorage.getItem('firstname') + ' ' + localStorage.getItem('lastname');
                    var initials = name.match(/\b\w/g) || [];
                    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
                    var newMember = {
                      email: that.state.email,
                      fullname: name,
                      initials: initials
                    }
                    members.push(newMember);
                    that.setState({members: members});
                    that.setState({invited: false});
                    this.setState({confirmation: true});
                  });
                  });
              }}>Join Group</Button>
              </Col>
            </Row>}
            {this.state.confirmation &&
              <Alert color="success">
                You are now a member of this Group
              </Alert>
            }
  					<br/>
  					<Typography variant="display1" gutterBottom>
  						{this.state.title} {' '}
              {this.state.member && <ConfirmationModal
								modalHeader="Unjoin Group"
								message=
								{<div>
                  <Typography variant="subheading" gutterBottom>Are you sure you want to unjoin this group?</Typography>
                  <Typography variant="subheading" gutterBottom>This group will no longer be visible from your dashboard.</Typography>
								</div>}
								onClick={this.leaveGroup.bind(this)}
								confirm='Unjoin'
							>

              <Chip
                className='leavechip'
                avatar={<LeaveIcon />}
                label='Unjoin Group'
                clickable
              />
            </ConfirmationModal>}
        		</Typography>
  					<Typography variant="subheading" gutterBottom>
  						Subject: {this.state.subject}
        		</Typography>
            {this.state.school != '' &&
  					<Typography variant="subheading" gutterBottom>
  						School: {this.state.school}
        		</Typography>}
            <hr/>
              <Row>
                <Typography variant="button" style={button}>
        					{this.state.followers.length}{' '}Followers
            		</Typography>
                {!this.state.member &&
            <Button onClick={(e) =>{
                let that = this;
                ax.get('/' + 'group' + '/' + this.props.id )
                .then(res => {
                  var group = res.data;
                  if(that.state.follower){
                    var i = group.followers.indexOf(that.state.email);
                    group.followers.splice(i, 1);
                  }
                  else{
                    group.followers.push(that.state.email);
                  }
                  !group.invited ? group.invited = [] : null;
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
                    that.setState({follower: !that.state.follower});
                    that.setState({followers: group.followers});
                  });
                });
              }}
              color='primary'
              variant={this.state.follower ? 'contained' : 'outlined'}
              disabled={this.state.email == ''}>
              <FollowIcon /> {' '}
    					{this.state.follower && <span>Following</span>}
      				{!this.state.follower && <span>Follow</span>}
        		</Button>}
            </Row>
            <hr/>
            <Typography variant="headline" gutterBottom>
    					Members
        		</Typography>
            {this.state.members.map(member =>
              <span key={member.email}>
                <Chip
                  className='chip'
                  avatar={<Avatar>{member.initials}</Avatar>}
                  label={member.fullname}
                  color="primary"
                />
              {' '}
              </span>
            )}
            {this.state.member &&
              <SearchUserModal id={this.props.id} members={this.state.members}>
                <Chip
                  className='addchip'
                  avatar={<AddIcon />}
                  label='Add Members'
                  clickable
                />
                {' '}
              </SearchUserModal>
            }
            <hr/>
  				</Col>
  			</Row>
  			</Container>
      </MuiThemeProvider>
        {this.state.member && <GroupPageNoteList id={this.props.id}/>}
        {!this.state.member &&
    			<MuiThemeProvider theme={buff}><GroupPageNotes id={this.props.id}/></MuiThemeProvider>}
      </div>
    );
	}
}
