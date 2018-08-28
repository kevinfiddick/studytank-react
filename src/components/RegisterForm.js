import React from 'react'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ax from './api';
import './Form.css';
import {Link} from 'react-router-dom';
import { sha256 } from './Encoder';


export default class RegisterForm extends React.Component {

    constructor() {
        super();
        this.state = {
          firstname: '',
          lastname: '',
          email: '',
          school: '',
          passwordInput: '',
          confirmPasswordInput: ''
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

          alert("here");
        if(user.passwordInput === user.confirmPasswordInput){
          sha256(user.passwordInput).then(function(value){
            user.password = value;
            alert(JSON.stringify(user));
            // Send a POST request
            ax({
              method: 'put',
              url: '/user/'+user.email,
              data: {
                email: user.email,
                password: user.password,
                firstname: user.firstname,
                lastname: user.lastname,
                school: user.school,
                notifications: []
              }
            });
          });
        }
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
            return (
              <div className="div">
                <Paper className="root" elevation={1}>
                  <Typography variant='headline' component='h1'>
                    Register
                  </Typography>
                  <form className="container" onSubmit={this.onSubmit}>
                    <TextField
                      required
                      id='firstname'
                      onChange={this.onChange}
                      label='First Name'
                      className="joinedtextField"
                      margin='normal'
                      />
                    <TextField
                      required
                      id='lastname'
                      onChange={this.onChange}
                      label='Last Name'
                      className="joinedtextField"
                      margin='normal'
                      />
                    <br/>
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
                      id='school'
                      onChange={this.onChange}
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
                    <Button type='submit' variant='outlined' color='primary' className="button">
                      Submit
                    </Button>
                  </form>
                  <Link to='/login'>Already Have An Account? Log In</Link>
                </Paper>
                <br/>
                <br/>
              </div>
            );
    }
}
