import React from 'react'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ax from './api';
import './Form.css';



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
          delete user.confirmPasswordInput;
            alert(JSON.stringify(user));
          ax.post('http://localhost:5984/newuser', { user })
            .then((result) => {
              //access the results here....
            }
          );
        }
    }

    render() {
            return (
              <div className="div">
                <Paper className="root" elevation={1}>
                  <Typography variant='headline' component='h1'>
                    Register
                  </Typography>
                  <form className="container" onSubmit={this.onSubmit} noValidate>
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
                </Paper>
              </div>
            );
    }
}
