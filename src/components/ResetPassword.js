import React from 'react'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ax from './api';
import './Form.css';
import {Alert} from "reactstrap";
import {Link} from 'react-router-dom';
import {withRouter} from "react-router-dom";
import {Router} from "react-router";
import { sha256 } from './Encoder';
import email from 'emailjs';

export default class ResetForm extends React.Component {

    constructor() {
        super();
        this.state = {
          email: '',
          code: '',
          codeInput: '',
          password1: '',
          password2: '',
          errorStatus: '',
          sent: false
        };
    }
    onChange = (e) => {
        // Because we named the inputs to match their corresponding values in state, it's
        // super easy to update the state
        this.setState({ [e.target.id]: e.target.value });
    }

    onSend(e){
      e.preventDefault();
      let that = this;
      ax.get('/user/_design/user/_view/exists?key="' + that.state.email + '"')
      .then((result) => {
        if(result.data.rows.length > 0 ){
          if(that.state.code.length !== 6){
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 6; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

            that.setState({ code: text });
          }
          alert(that.state.code);

                var server 	= email.server.connect({
                  user:    "kevinfiddick",
                  password:"egoFriendly123",
                  host:    "smtp.zoho.com",
                  ssl:     true
                });

                // send the message and get a callback with an error or details of the message that was sent
                server.send({
                  text:    "Reset your password by using this code: \n\n" + this.state.code ,
                  from:    "StudyTank <kevinfiddick@studytank.com>",
                  to:      " <"+this.state.email+">",
                  subject: "Password Reset"
                }, function(err, message) { console.log(err || message); });


          that.setState({ sent: true });
        }else{
          that.setState({ errorStatus: "No users are registered under " + that.state.email});
        }
        });
    }

    onUpdate(e){
      e.preventDefault();
      let that = this;
      if(that.state.code === that.state.codeInput.trim()){
        if(that.state.password1 === that.state.password2){
          const password = sha256(this.state.password1);
          ax.get('/user/' + that.state.email)
          .then((result) => {
            password.then(function(value){
              const user = result.data;
              user.password = value;
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
              }).then((postResult) => {
                localStorage.setItem('email', user.email);
                localStorage.setItem('password', value);
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
                window.location.replace("/dashboard/notes");
              });
            });
          });
        }
        else{
          that.setState({ errorStatus: "Your passwords do not match" });
        }
      }
      else{
        that.setState({ errorStatus: "The code you entered was incorrect" });
      }
    }

    componentWillMount(){
    }

    render() {
            return (
              <div className="div">
                <Paper className="root" elevation={1}>
                  <Typography variant='headline' component='h1'>
                    Recover Password
                  </Typography>
                  <br/>
                  {this.state.errorStatus != '' &&
                    <Alert color="danger">
                      {this.state.errorStatus.split('\n').map((item, i) => <div key={i}>{item}</div>)}
                    </Alert>
                  }
                {!this.state.sent &&
                  <form className="container" onSubmit={this.onSend.bind(this)}>
                    <TextField
                      required
                      id='email'
                      onChange={this.onChange.bind(this)}
                      label='Email'
                      className="textField"
                      margin='normal'
                      />
                    <br/>
                    <Button type='submit' variant='outlined' color='primary' className="button">
                      Send
                    </Button>
                  </form>
                }
                {this.state.sent &&
                <form className="container" onSubmit={this.onUpdate.bind(this)}>
                  <TextField
                    required
                    id='codeInput'
                    onChange={this.onChange.bind(this)}
                    label='Reset Code'
                    className="textField"
                    margin='normal'
                    helperText='Check Your Email'
                    />
                  <br/>
                  <TextField
                    required
                    id='password1'
                    onChange={this.onChange.bind(this)}
                    label='New Password'
                    className="textField"
                    type='password'
                    margin='normal'
                    />
                  <br/>
                  <TextField
                    required
                    id='password2'
                    onChange={this.onChange.bind(this)}
                    label='Confirm New Password'
                    className="textField"
                    type='password'
                    margin='normal'
                    />
                  <br/>
                  <Button type='submit' variant='outlined' color='primary' className="button">
                    Update
                  </Button>
                </form>
              }
                </Paper>
              </div>
            );
    }
}
