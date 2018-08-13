import React from 'react'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ax from './api';
import './Form.css';
import {Link} from 'react-router-dom';
import {withRouter} from "react-router-dom";
import {Router} from "react-router";
import { sha256 } from './Encoder';

export default class LogInForm extends React.Component {

    constructor() {
        super();
        this.state = {
          email: '',
          password: ''
        };
    }
    onChange = (e) => {
        // Because we named the inputs to match their corresponding values in state, it's
        // super easy to update the state
        this.setState({ [e.target.id]: e.target.value });
    }

    onSubmit = (e) => {
        e.preventDefault();
        // get our form data out of state
        const user = this.state;
        const password = sha256(user.password);
          ax.get('http://localhost:5984/user/' + user.email)
            .then((result) => {
              password.then(function(value){
                if (result.data.password === value) {
                  console.log("Logged In!");
                  localStorage.setItem('email', user.email);
                  localStorage.setItem('password', value);

                  const MONTH_IN_MS = 2678400000;
                  var grace = 3 * MONTH_IN_MS;
                  localStorage.setItem('expires', Date.now() + grace);

                  window.location.replace("/dashboard/notes");
                }
                else{
                    alert("Incorrect Password");
                }
              })

            })
            .catch(function (error) {
              console.log(error);
              if(error.response.status == 404){
                alert("No users are registered under \n" + user.email +
                  "\n Please try another email or Register for free");
              } else{
                alert("An error occured, please try again later.");
              }
            }
          );
    }

    componentWillMount(){
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
            const { email, password } = this.state;
            return (
              <div className="div">
                <Paper className="root" elevation={1}>
                  <Typography variant='headline' component='h1'>
                    Log In
                  </Typography>
                  <form className="container" onSubmit={this.onSubmit}>
                    <TextField
                      required
                      id='email'
                      onChange={this.onChange}
                      label='Email'
                      className="textField"
                      margin='normal'
                      />
                    <br/>
                    <TextField
                      required
                      id='password'
                      onChange={this.onChange}
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
