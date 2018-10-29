import React from 'react';
import Button from '@material-ui/core/Button';
import ConfirmationModal from './ConfirmationModal';
import {Container, Row, Col} from "reactstrap";
import CoursePageNoteList from './FilterNoteListCoursePageSel';
import CoursePageNotes from './FilterNoteListCoursePage';
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
import AddStudentsModal from './AddStudentsModal';
import AddAdminModal from './AddAdminModal';
import LearningOutcomeModal from './LearningOutcomeModal';
import Authentification from './Authentification';
import './Form.css';
import './Link.css';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import FollowIcon from "@material-ui/icons/PeopleOutline";
import {Alert} from "reactstrap";

const theme = createMuiTheme({
  palette: {
	   primary: {
	     light: '#616161',
	     main: '#616161',
	     dark: '#212121',
	     contrastText: '#fff',
	   }
  }
});

const buff = createMuiTheme({
  palette: {
	   primary: {
	     light: '#616161',
	     main: '#616161',
	     dark: '#212121',
	     contrastText: '#fff',
	   }
  },
	overrides: {
      MuiButton: {
        root: {
          marginTop: 6,
        }
      }
    }
});

  const button = {
    padding: '11px',
    marginLeft: '15px'
  }

export default class CoursePage extends React.Component {
  state = {
    id: '',
    professor: '',
    email: '',
    title: '',
    course: '',
    school: '',
    admin: false,
    admins: [],
    student: false,
    students: [],
    invited: [],
    outcomes: [],
    filter: []
  };

  selectedIDs(array){
    this.setState({filter: array});
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

    ax.get('/' + 'course' + '/' + this.props.id )
      .then(res => {
          var course = res.data;
          that.setState({ id: this.props.id });
          that.setState({ title: course.title });
          that.setState({ course: course.course });
          that.setState({ school: course.school });
          that.setState({ professor: course.professor });
          that.setState({ invited: course.invited });
          that.setState({ outcomes: course.outcomes });

          var students = that.state.students;
          while(course.students.length > 0){
            var student = course.students.shift();
            var name = student.firstname + ' ' + student.lastname;
            var initials = name.match(/\b\w/g) || [];
            initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
            var studentData = {
              fullname: name,
              email: student.email,
              initials: initials
            };
            students.push(studentData);
            if(student.email == email) that.setState({student: true});
          }
          that.setState({students: students});

          var admins = that.state.admins;
          while(course.admins.length > 0){
            var admin = course.admins.shift();
            var name = admin.firstname + ' ' + admin.lastname;
            var initials = name.match(/\b\w/g) || [];
            initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
            var adminData = {
              fullname: name,
              email: admin.email,
              initials: initials
            };
            admins.push(adminData);
            if(admin.email == email) that.setState({admin: true});
          }
          that.setState({admins: admins});
      });
	}

  render() {
		return(
    <div>
      {(this.state.student || this.state.admin) &&
      <div>
        <Container>
  			<Row>
  				<Col md={{ size: 8, offset: 2 }} xs={{ size: 12, offset: 0 }}>
  					<br/>
  					<Typography variant="display1" gutterBottom>
  						{this.state.title}
        		</Typography>
  					<Typography variant="subheading" gutterBottom>
              Professor: {this.state.professor}
        		</Typography>
  					<Typography variant="subheading" gutterBottom>
  						Course: {this.state.course}
        		</Typography>
  					<Typography variant="subheading" gutterBottom>
  						School: {this.state.school}
        		</Typography>
            <hr/>
            {this.state.admin &&
              <div>
              {this.state.invited.length > 0 &&
                <div>
              <Typography variant="headline" gutterBottom>
                Invited
              </Typography>
              {this.state.invited.map(student =>
                <span key={student.email}>
                  <Chip
                    className='chip'
                    label={student.email}
                  />
                {' '}
                </span>
              )}
            <hr/>
            </div>}
                <Typography variant="headline" gutterBottom>
                  Students
                </Typography>
                	<MuiThemeProvider theme={theme}>
                {this.state.students.map(student =>
                  <span key={student.email}>
                    <Chip
                      className='chip'
                      avatar={<Avatar>{student.initials}</Avatar>}
                      label={student.fullname}
                      color='primary'
                    />
                  {' '}
                  </span>
                )}
              </MuiThemeProvider>
                <AddStudentsModal id={this.props.id} students={this.state.students}>
                  <Chip
                    className='addchip'
                    avatar={<AddIcon />}
                    label='Add Students'
                    clickable
                  />
                  {' '}
                </AddStudentsModal>
                </div>
              }
                {this.state.student &&
                <Row>
                  <Typography variant="button" style={button}>
          					{this.state.students.length}{' '}Enrolled
              		</Typography>
                </Row>}
            <hr/>
            {this.state.admin && <div>
            <Typography variant="headline" gutterBottom>
    					Admins
        		</Typography>
            {this.state.admins.map(admin =>
              <span key={admin.email}>
                <Chip
                  className='chip'
                  avatar={<Avatar>{admin.initials}</Avatar>}
                  label={admin.fullname}
                  color="primary"
                />
              {' '}
              </span>
            )}
              <AddAdminModal id={this.props.id} admins={this.state.admins}>
                <Chip
                  className='addchip'
                  avatar={<AddIcon />}
                  label='Add Admins'
                  clickable
                />
                {' '}
              </AddAdminModal>
            <hr/>
              </div>}
  			      <LearningOutcomeModal
                outcomes={this.state.outcomes}
                courseID={this.state.id}
                selectedIDs={this.selectedIDs.bind(this)}
                admin={this.state.admin}
              >
              <Button
  			        variant="contained"
  			        color='primary'
  							fullWidth
  							className="lightlink"
  			      >
               <span style={{paddingLeft: 10}} > Learning Outcomes </span>
  			      </Button>
             </LearningOutcomeModal>
              {this.state.admin &&
            <MuiThemeProvider theme={buff}>
              <Button
                variant="contained"
                fullWidth
                className="darklink"
                component={Link}
  							to={'/newcontent/' + this.props.id}
              >
              <span style={{paddingLeft: 10}} > Upload Course Material </span>
              </Button>
          </MuiThemeProvider>
              }
              <hr/>
  				</Col>
  			</Row>
  			</Container>
        {this.state.admin &&
          <MuiThemeProvider theme={theme}><CoursePageNoteList filter={this.state.filter} id={this.props.id} />
        </MuiThemeProvider>}
        {!this.state.admin &&
    			<MuiThemeProvider theme={buff}>
          <CoursePageNotes filter={this.state.filter} id={this.props.id} />
          </MuiThemeProvider>}
      </div>}
        {!(this.state.student || this.state.admin) &&
        <div>
          <Container>
    			<Row>
    				<Col md={{ size: 8, offset: 2 }} xs={{ size: 12, offset: 0 }}>
    					<br/>
    					<Typography variant="display1" gutterBottom>
    						Access Denied
          		</Typography>
    					<Typography variant="subheading" gutterBottom>
                You are not enrolled in this course
          		</Typography>

    				</Col>
    			</Row>
    			</Container>
        </div>}

    </div>);
  }
}
