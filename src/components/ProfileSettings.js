import React from 'react'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import {Container, Row, Col} from "reactstrap";
import ax from './api';
import { sha256 } from './Encoder';

import SecurityIcon from '@material-ui/icons/Security';

import './Form.css'
import './FilterList.css'



export default class CreateGroupForm extends React.Component {

    constructor() {
        super();
        this.state = {
          school: '',
          password: '',
          newPassword: '',
          confirmPassword: '',
          updateSchoolStatus: 'Update',
          updatePasswordStatus: 'Update'
        };
    }
    onChange = (e) => {
        // Because we named the inputs to match their corresponding values in state, it's
        // super easy to update the state
        this.setState({ [e.target.id]: e.target.value });

    }

    onSchoolSubmit = (e) => {
        e.preventDefault();
        this.setState({updateSchoolStatus: 'Please Wait...' });
        // get our form data out of state
        const school = this.state.school;

        ax.get('http://localhost:5984/user/' + 'fiddickkg@msoe.edu')
          .then((result) => {
            var user = result.data;
              console.log(result);
            ax({
              method: 'post',
              url: '/user',
              data: {
                _id: user._id,
                _rev: user._rev,
                email: user.email,
                password: user.password,
                firstname: user.firstname,
                lastname: user.lastname,
                school: school,
                notifications: user.notifications
              }
            }).then((postResult) => {
              this.setState({updateSchoolStatus: 'Updated' });

            });
          }
        );
    }

    onPasswordSubmit = (e) => {
        e.preventDefault();
        this.setState({updateSchoolStatus: 'Please Wait...' });
        // get our form data out of state
        const school = this.state.school;

        ax.get('http://localhost:5984/user/' + 'fiddickkg@msoe.edu')
          .then((result) => {
            var user = result.data;
            user.school = school;
            ax.post('http://localhost:5984/user', { user })
              .then((result) => {
                console.log(result);
                this.setState({updateSchoolStatus: 'Updated' });

              }
            );
          }
        );
    }

    render() {
            const {resize} = {
              fontSize:50
            }
            return (
        			<Container>
        					<Col md={{ size: 8, offset: 2 }} xs={{ size: 12, offset: 0 }}>
              <form onSubmit={this.onSchoolSubmit}>
                <br/>
                    <Typography variant='subheading'>
                      Update Your School of Attendance
                    </Typography>
        				<Row>
                    <Grid container spacing={8} alignItems="flex-end">
                      <Grid item xs={1}>
                        <span style={{
  padding: '10px 0',
  float: 'right'
}} ></span>
                      </Grid>
                      <Grid item xs={10}>
          						        <TextField
                                required
                    		        id='school'
          					            onChange={this.onChange}
                                label='School of Attendance'
          							        margin='normal'
          							        fullWidth
                  		        />
                      </Grid>
                    </Grid>
                </Row>
        				<Row>
                    <Grid container spacing={8} alignItems="flex-end">
                      <Grid item xs={1}>
                        <span style={{
  padding: '10px 0',
  float: 'right'
}} ></span>
                      </Grid>
                      <Grid item xs={10}>
                        <Button type='submit' variant='outlined' className="button">
                          {this.state.updateSchoolStatus}
                        </Button>
                      </Grid>
                    </Grid>
                </Row>
            </form>
              <form onSubmit={this.onPasswordSubmit}>
                <br/>
                    <Typography variant='subheading'>
                      Update Your Password
                    </Typography>
        				<Row>
                    <Grid container spacing={8} alignItems="flex-end">
                      <Grid item xs={1}>
                        <span style={{
                            padding: '10px 0',
                            float: 'right'
                          }} > </span>
                      </Grid>
                      <Grid item xs={10}>
                        <TextField
                          required
                          id='newPassword'
                          onChange={this.onChange}
                          label='New Password'
                          margin='normal'
                          type='password'
                          fullWidth
                          />
                      </Grid>
                    </Grid>
                </Row>
        				<Row>
                    <Grid container spacing={8} alignItems="flex-end">
                      <Grid item xs={1}>
                        <span style={{
  padding: '10px 0',
  float: 'right'
}} > </span>
                      </Grid>
                      <Grid item xs={10}>
                        <TextField
                          required
                          id='confirmPassword'
                          onChange={this.onChange}
                          label='Confirm New Password'
                          type='password'
                          margin='normal'
                          fullWidth
                          />
                      </Grid>
                    </Grid>
                </Row>
        				<Row>
                    <Grid container spacing={8} alignItems="flex-end">
                      <Grid item xs={1}>
                        <span style={{
  padding: '10px 0',
  float: 'right'
}} > <SecurityIcon /> </span>
                      </Grid>
                      <Grid item xs={10}>
                        <TextField
                          required
                          id='password'
                          onChange={this.onChange}
                          label='Current Password'
                          type='password'
                          margin='normal'
                          fullWidth
                          />
                      </Grid>
                    </Grid>
                </Row>
        				<Row>
                    <Grid container spacing={8} alignItems="flex-end">
                      <Grid item xs={1}>
                        <span style={{
  padding: '10px 0',
  float: 'right'
}} ></span>
                      </Grid>
                      <Grid item xs={10}>
                        <Button type='submit' variant='outlined' className="button">
                          {this.state.updatePasswordStatus}
                        </Button>
                      </Grid>
                    </Grid>
                </Row>
                    </form>
            </Col>
              </Container>
            );
    }
}
