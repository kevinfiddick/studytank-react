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

export default class LogInForm extends React.Component {

    constructor() {
        super();
        this.state = {
          email: '',
          password: '',
          errorStatus: ''
        };
    }
    onChange = (e) => {
        // Because we named the inputs to match their corresponding values in state, it's
        // super easy to update the state
        this.setState({ [e.target.id]: e.target.value });
    }

    onSubmit = (e) => {
        // get our form data out of state
        const password = sha256(this.state.password);
        let that = this;
          ax.get('http://localhost:5984/user/' + this.state.email)
            .then((result) => {
              password.then(function(value){
                const user = result.data;
                if (user.password === value) {
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
                }
                else{
                  var errorStatus = 'Incorrect Password';
                  if(that.state.errorStatus.search('Incorrect Password') == 0){
                    errorStatus = that.state.errorStatus + '!';
                  }
                  that.setState({errorStatus: errorStatus });
                }
              })

            })
            .catch(function (error) {
              console.log(error);
              if(error.response.status == 404){
                var errorStatus = "No users are registered under \n" + that.state.email +
                  "\n Please try another email or Register for free";
                that.setState({ errorStatus: errorStatus });
              } else{
                that.setState({ errorStatus: "An error occured, please try again later." });
              }
            }
          );
              e.preventDefault();
    }

    componentDidMount(){
      //checks if localStorage is expired
      const MONTH_IN_MS = 2678400000;
      var expiration = 0;
      var grace = 3 * MONTH_IN_MS;
      var email = '';
      var password = '';
      //save local storage email and password for easy access
      try{
          email = localStorage.getItem("email");
          password = localStorage.getItem("password");
          expiration = localStorage.getItem("expires");
          console.log(password);
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
            const { email, password, errorStatus } = this.state;
            return (
              <div className="div">
                <Paper className="root" elevation={1}>
                  <Typography variant='headline' component='h1'>
                    Log In
                  </Typography>
                  <br/>
                  {this.state.errorStatus != '' &&
                    <Alert color="danger">
                      {this.state.errorStatus.split('\n').map((item, i) => <div key={i}>{item}</div>)}
                    </Alert>
                  }
                  <form className="container" onSubmit={this.onSubmit.bind(this)}>
                    <TextField
                      required
                      id='email'
                      onChange={this.onChange.bind(this)}
                      label='Email'
                      className="textField"
                      margin='normal'
                      />
                    <br/>
                    <TextField
                      required
                      id='password'
                      onChange={this.onChange.bind(this)}
                      label='Password'
                      className="textField"
                      type='password'
                      autoComplete='currentPassword'
                      margin='normal'
                      />
                    <br/>
                    <Button type='submit' variant='outlined' color='primary' className="button">
                      Log In
                    </Button>

                  </form>
                  <Link to='/register'>or Register Here (It's Free!)</Link>
                </Paper>
              </div>
            );
    }
}
