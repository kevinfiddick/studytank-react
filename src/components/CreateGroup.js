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
          id: '',
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
        ax({
          method: 'put',
          url: '/group/'+group.id,
          data: {
            title: group.title,
            subject: group.subject,
            school: group.school,
            members: [
              {
                email: localStorage.getItem('email'),
                firstname: localStorage.getItem('firstname'),
                lastname: localStorage.getItem('lastname')
              }
            ],
            followers: [],
            invited: []
          }
        }).then((result) => {
            window.location.replace("/group/"+this.state.id);
        }).catch(function (error) {

        });
    }

    componentDidMount(){
      this.setState({ id: Date.now() });
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
