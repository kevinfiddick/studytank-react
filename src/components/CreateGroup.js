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

import GroupIcon from '@material-ui/icons/Group';
import SubjectIcon from '@material-ui/icons/Label';

import './Form.css'
import './FilterList.css'



export default class CreateGroupForm extends React.Component {

    constructor() {
        super();
        this.state = {
          title: '',
          subject: '',
          school: ''
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
        const group = this.state;

          alert("here");
        if(group.passwordInput === group.confirmPasswordInput){
          delete group.confirmPasswordInput;
            alert(JSON.stringify(group));
          ax.post('http://localhost:5984/group', { group })
            .then((result) => {
              //access the results here....
            }
          );
        }
    }

    render() {
            const {resize} = {
              fontSize:50
            }
            return (
        			<Container>
                <form onSubmit={this.onSubmit}>
        					<Col md={{ size: 8, offset: 2 }} xs={{ size: 12, offset: 0 }}>
        				<Row>
                    <Grid container spacing={8} alignItems="flex-end">
                      <Grid item xs={1}>
                        <span style={{
                          padding: '10px 0',
                          float: 'right'
                        }} > <GroupIcon /> </span>
                      </Grid>
                      <Grid item xs={10}>
          						        <TextField
                                required
                    		        id='title'
          					            onChange={this.onChange}
                                label='Group Name'
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
}} > <SubjectIcon /> </span>
                      </Grid>
                      <Grid item xs={10}>
                        <TextField
                          required
                          id='subject'
                          onChange={this.onChange}
                          label='Subject'
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
                        <TextField
                          id='school'
                          onChange={this.onChange}
                          label='School'
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
                          Create
                        </Button>
                      </Grid>
                    </Grid>
                </Row>
            </Col>
                </form>
              </Container>
            );
    }
}
