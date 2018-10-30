import React from 'react'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ax from './api';
import './Form.css';
import {Link} from 'react-router-dom';
import { sha256 } from './Encoder';
import TermsAndConditions from './TermsAndConditions'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {Alert} from "reactstrap";
import emailjs from 'emailjs-com';

export default class RegisterForm extends React.Component {

    constructor() {
        super();
        this.state = {
          firstname: '',
          lastname: '',
          email: '',
          og: '',
          school: '',
          passwordInput: '',
          confirmPasswordInput: '',
          checkBox: false,
          errorStatus: '',
          invited: [],
          confirmation: '',
          confirm: false,
          confirmInput: ''
        };
    }
    onChange = (e) => {
        this.setState({ errorStatus: ''});
        // Because we named the inputs to match their corresponding values in state, it's
        // super easy to update the state
        this.setState({ [e.target.id]: e.target.value });
    }
    onCheck = (e) => {
        this.setState({ errorStatus: ''});
        // Because we named the inputs to match their corresponding values in state, it's
        // super easy to update the state
        this.setState({ [e.target.value]: e.target.checked });
    }

    makeid() {

      this.setState({ confirm: true });
      if(this.state.confirmation.length !== 5){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

        this.setState({ confirmation: text });
      }

      var template_params = {
        "email": this.state.email,
        "code": this.state.confirmation
      }

      var service_id = "zoho";
      var template_id = "confirmation_email";
      window.emailjs.send(service_id,template_id,template_params);

      return text;
    }

    confirm(){
      if(this.state.confirmation == this.state.confirmInput){
        this.register();
      }
      else{
        this.setState({ errorStatus: "The Confirmation Code You Entered was Incorrect"});
      }
    }

    register(){
    // get our form data out of state
    const user = this.state;
    let that = this;

      sha256(user.passwordInput).then(function(value){
        user.password = value;

        const generateUsername = (counter) => {
          var username = user.firstname.trim().replace(/\s/g,'-').toLowerCase() + '-' + user.lastname.trim().replace(/\s/g,'-').toLowerCase() + '-' + counter;
          ax.get('/user/_design/user/_view/username?key="' + username + '"')
          .then((result) => {
            if(result.data.rows.length > 0 ){
              generateUsername(counter+1)
            }else{
              user.username = username;
          ax({
            method: 'put',
            url: '/user/'+user.email,
            data: {
              email: user.email,
              username: user.username,
              password: user.password,
              firstname: user.firstname,
              lastname: user.lastname,
              school: user.school,
              confirmed: user.confirmed,
              notifications: []
            }
          }).then((result) => {

            ax.get('/' + 'course' + '/' + '_design/invited/_view/email?key="'+user.email+'"')
            .then(res => {
              var i = 0;
              const reCourse = () => {
              if( i < res.data.rows.length ){
                var course = res.data.rows[i].value;
                //remove newly registered student from invited list
                course.invited.splice(course.invited.indexOf(course.invited.find(function(element) {
                  return element.email == user.email;
                })), 1);
                //add newly registered student to student list if not there already
                var check = course.students.map(a => a.email);
                if(!check.includes(user.email)){
                  course.students.push({
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname
                  });
                }
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
                      i++;
                      reCourse();
                    });
              }
              else{
              window.location.replace("/dashboard/notes");}
              }

              localStorage.setItem('email', user.email);
              localStorage.setItem('password', user.password);
              localStorage.setItem('firstname', user.firstname);
              localStorage.setItem('lastname', user.lastname);
              localStorage.setItem('username', user.username);
              localStorage.setItem('school', user.school);

              const MONTH_IN_MS = 2678400000;
              var grace = 3 * MONTH_IN_MS;
              localStorage.setItem('expires', Date.now() + grace);
              reCourse();
            })
            .catch(c => {
            });
          }).catch(function (error) {
              that.setState({ errorStatus: "An error occured, please try again later."});
          });
        }
          });
        }

        generateUsername(1);
      });
    }

    onSubmit = (e) => {
        this.setState({ errorStatus: ''});
        e.preventDefault();
        const user = this.state;
        let that = this;
        ax.get('/user/_design/user/_view/exists?key="' + this.state.email + '"')
        .then((result) => {
          if(result.data.rows.length > 0 ){
            that.setState({ errorStatus: "A user is already registered under " + user.email});
          }else{
            if(user.passwordInput === user.confirmPasswordInput){

                var confirmed = (that.state.email == that.state.og);
                if(confirmed){
                  that.register();
                }
                else{
                  that.makeid();
                }

              }
              else{
                this.setState({ errorStatus: "Your passwords do not match"});
              }
            }
          });
    }

    componentWillMount(){
      //checks if localStorage is expired
      const MONTH_IN_MS = 2678400000;
      var expiration = 0;
      var grace = 3 * MONTH_IN_MS;
      var email = '';
      var password = '';
      if(this.props.id != '' && this.props.id != null){
        let that = this;
      ax.get('/' + 'course' + '/' + '_design/invited/_view/id?key="'+this.props.id+'"')
        .then(res => {
          if(res.data.rows.length > 0 ){
            that.setState({invited: res.data.rows.map(a => a.value)});
            var course = res.data.rows[0].value;
            var student = course.invited.find(function(element) {
              return element.id == that.props.id;
            });
            that.setState({email: student.email});
            that.setState({og: student.email});
            that.setState({school: course.school});
          }
        })
        .catch(c => {
        });

      }

      //save local storage email and password for easy access
      try{
          email = localStorage.getItem("email");
          password = localStorage.getItem("password");
          expiration = localStorage.getItem("expires");
          if(expiration < Date.now()){
              localStorage.clear();
          }
          else{
              localStorage.setItem("expires", Date.now() + grace);
              ax.get('/' + 'user' + '/' + email)
        				.then(res => {
                  if (res.data.password === password) {
                    window.location.replace("/dashboard/notes");
                  }
        				})
                .catch(c => {
                });
        	}
      }catch(e){
      }
    }

    render() {
            return (
              <div className="div">
                <Paper className="root" elevation={1}>
                  {!this.state.confirm &&
                  <div>
                  <Typography variant='headline' component='h1'>
                    Register
                  </Typography>
                  <form className="container" onSubmit={this.onSubmit}>
                    <TextField
                      required
                      id='firstname'
                      onChange={this.onChange}
                      value={this.state.firstname}
                      label='First Name'
                      className="joinedtextField"
                      margin='normal'
                      />
                    <TextField
                      required
                      id='lastname'
                      onChange={this.onChange}
                      value={this.state.lastname}
                      label='Last Name'
                      className="joinedtextField"
                      margin='normal'
                      />
                    <br/>
                    <TextField
                      required
                      id='email'
                      onChange={this.onChange}
                      value={this.state.email}
                      label='Email'
                      className="textField"
                      margin='normal'
                      />
                    <br/>
                    <TextField
                      id='school'
                      onChange={this.onChange}
                      value={this.state.school}
                      label='School of Attendance'
                      className="textField"
                      margin='normal'
                      />
                    <br/>
                    <TextField
                      required
                      id='passwordInput'
                      onChange={this.onChange}
                      label='Password'
                      className="textField"
                      type='password'
                      autoComplete='currentPassword'
                      margin='normal'
                      />
                    <br/>
                    <TextField
                      required
                      id='confirmPasswordInput'
                      onChange={this.onChange}
                      label='Confirm Password'
                      className="textField"
                      type='password'
                      autoComplete='currentPassword'
                      margin='normal'
                      />
                    <br/>
                      <FormControlLabel
                        control={
                          <Checkbox
                            required
                            checked={this.state.checkBox}
                            onChange={this.onCheck}
                            value="checkBox"
                            color="primary"
                            />
                        }
                        label="I have read and agreed to the Terms and Conditions"
                      />
                    <br/>
                      <TermsAndConditions variant='outlined' color='default' className="button">Terms and Conditions</TermsAndConditions>{' '}
                        {this.state.errorStatus != '' &&
                          <Alert color="danger">
                            {this.state.errorStatus.split('\n').map((item, i) => <div key={i}>{item}</div>)}
                          </Alert>
                        }
                    <Button type='submit' variant='outlined' color='primary' className="button">
                      Submit
                    </Button>
                  </form>
                  <Link to='/login'>Already Have An Account? Log In</Link>
                  </div>}

                  {this.state.confirm &&
                    <div>
                    {this.state.errorStatus !== '' &&
                      <Alert color="danger">
                        {this.state.errorStatus.split('\n').map((item, i) => <div key={i}>{item}</div>)}
                      </Alert>
                    }
                    {this.state.errorStatus === '' &&
                      <Alert color="warning">
                        Do not leave this page, your progress will not be saved
                      </Alert>
                    }
                    <Typography variant='headline' component='h1'>
                      {'Check your email : ' + this.state.email}
                    </Typography>
                    <TextField
                      fullWidth
                      id='confirmInput'
                      onChange={this.onChange}
                      value={this.state.confirmInput}
                      label='Confirmation Code'
                      className="textField"
                      margin='normal'
                      />
                    <Button onClick={this.confirm.bind(this)} variant='outlined' color='primary' className="button">
                    Confirm
                  </Button>
                  </div>
                  }
                </Paper>
                <br/>
                <br/>
              </div>
            );
    }
}
