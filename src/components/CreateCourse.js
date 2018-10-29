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
import emailjs from 'emailjs-com';

import './Form.css'
import './FilterList.css'



export default class CreateCourseForm extends React.Component {

    constructor() {
        super();
        this.state = {
          id: '',
          title: '',
          course: '',
          professor: '',
          school: '',
          emailList: '',
          students: [],
          invited: [],
          outcomes: [],
          newOutcomes: []
        };
    }

    onChange = (e) => {
        // Because we named the inputs to match their corresponding values in state, it's
        // super easy to update the state
        this.setState({ [e.target.id]: e.target.value });
    }
      onUserInput(e){
        var id = e.target.id;
        var description = e.target.value;
        var newOutcomes = this.state.newOutcomes;
        var index = newOutcomes.findIndex(function(element) {
          return element.id == id;
        });
        newOutcomes[index] = {
            id: id,
            description: description
        };
        this.setState({ newOutcomes: newOutcomes });
      }

      newOutcome(){
        var newOutcomes = this.state.newOutcomes;
        newOutcomes.push({
            id: ((Date.now() + Math.random() + 1) * 10000).toString(),
            description: ''
        });
        this.setState({ newOutcomes: newOutcomes });
      }

    onSubmit = (e) => {
        e.preventDefault();
        // get our form data out of state
        const course = this.state;
        var newOutcomes = this.state.newOutcomes;
        var outcomes = [];
        for(var i = 0; i < newOutcomes.length; i++){
          var outcome = newOutcomes[i];
          if(outcome.description != ''){
            outcomes.push(outcome);
          }
        }
        course.outcomes = outcomes;
        course.admins = [
          {
            email: localStorage.getItem('email'),
            firstname: localStorage.getItem('firstname'),
            lastname: localStorage.getItem('lastname')
          }
        ];
        let that = this;
        ax({
          method: 'put',
          url: '/course/'+course.id,
          data: {

            title: course.title,
            course: course.course,
            school: course.school,
            professor: course.professor,
            admins: course.admins,
            students: course.students,
            invited: course.invited,
            outcomes: course.outcomes
          }
        }).then((result) => {
          course._id = result.data.id;
          course._rev = result.data.rev;
          var i = 0;
          var emails = course.emailList.toLowerCase();
          emails = emails.replace(/\n/g, ",").replace(/\r/g, ",").split(/[\s,]+/);
          var recursiveNotify = () => {
           if(i < emails.length) {
             var check = course.students.map(a => a.email);
             if(!check.includes(emails[i])){
             ax.get('/' + 'user' + '/' + emails[i] )
             .then(rs => {
               var user = rs.data;
               if(!user.hasOwnProperty('username')){
                 user.username =
                   user.firstname.trim().replace(/\s/g,'-').toLowerCase() + '-' + user.lastname.trim().replace(/\s/g,'-').toLowerCase();
               }
               user.notifications.push({
                 id: Date.now(),
                 seen: false,
                 page: "course",
                 linkID: that.props.id,
                 phrase: 'You have been added to the following course: ' + course.title
               });
               course.students.push({
                 email: user.email,
                 firstname: user.firstname,
                 lastname: user.lastname
               });
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
               }).then(r => {
                 i++;
                 recursiveNotify();
               });
             })
             .catch(er => {
               if(emails[i] != '' && emails[i] != null){
                 const unique = sha256("email:"+emails[i]);
                 unique.then(function(value){

                   var template_params = {
                     "email": emails[i],
                     "professor": course.professor,
                     "title": course.title,
                     "course": course.course,
                     "url": "https://www.studytank.com/quickreg/" + value
                   }

                   var service_id = "zoho";
                   var template_id = "register";
                   emailjs.send(service_id,template_id,template_params);

                   var test = course.invited.map(a => a.email);
                   if(!test.includes(emails[i])) course.invited.push({id: value, email: emails[i]});
                   i++;
                   recursiveNotify();
                 });
               }
             });
           }else{
             i++;
             recursiveNotify();
           }}else{
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
                  window.location.replace("/course/"+this.state.id);
               });
             }
         }
         recursiveNotify();
        }).catch(function (error) {

        });
    }

    componentDidMount(){
      this.setState({ id: Date.now() });

      emailjs.init('user_IIXSfQkpkB9MvfzqwbBLk');
      
      this.setState({ email: localStorage.getItem('email')});
        var outcomes = [];
        outcomes = outcomes.concat(this.state.outcomes);
        outcomes.push({
          id: ((Date.now() + Math.random() + 1) * 10000).toString(),
          description: ''
        });
        this.setState({
          newOutcomes: outcomes
        });
    }

    render() {
            const {resize} = {
              fontSize:50
            }
            return (
        			<Container>
                {(this.state.email == 'kevinfiddick@studytank.com' || this.state.email == 'tyler@studytank.com') &&
                <form onSubmit={this.onSubmit}>
        					<Col md={{ size: 8, offset: 2 }} xs={{ size: 12, offset: 0 }}>
        				<Row>
                    <Grid container spacing={8} alignItems="flex-end">
                      <Grid item xs={12}>
          						        <TextField
                                required
                    		        id='title'
          					            onChange={this.onChange}
                                label='Course Name'
          							        margin='normal'
          							        fullWidth
                  		        />
                      </Grid>
                    </Grid>
                </Row>
        				<Row>
                    <Grid container spacing={8} alignItems="flex-end">
                      <Grid item xs={12}>
                        <TextField
                          required
                          id='course'
                          onChange={this.onChange}
                          label='Course #'
                          margin='normal'
                          fullWidth
                          />
                      </Grid>
                    </Grid>
                </Row>
        				<Row>
                    <Grid container spacing={8} alignItems="flex-end">
                      <Grid item xs={12}>
                        <TextField
                          required
                          id='professor'
                          onChange={this.onChange}
                          label='Professor'
                          margin='normal'
                          fullWidth
                          />
                      </Grid>
                    </Grid>
                </Row>
        				<Row>
                    <Grid container spacing={8} alignItems="flex-end">
                      <Grid item xs={12}>
                        <TextField
                          required
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
                      <Grid item xs={12}>
                        <TextField
                          id="emailList"
                          label="Student Email List"
                          multiline
                          margin="normal"
                          className="filter"
                          onChange={this.onChange}
                          fullWidth
                          autoComplete='off'
                          helperText="Seperate emails by comma, spaces, or seperate lines."
                        />
                      </Grid>
                    </Grid>
                </Row>
        				<Row>
                    <Grid container spacing={8} alignItems="flex-end">
                      <Grid item xs={12}>
                  {this.state.newOutcomes.map((outcome, i) =>
                    <TextField
                      multiline
                      key={outcome.id}
                      id={outcome.id}
                      label={"Learning Outcome #" + (i + 1)}
                      margin="normal"
                      className="filter"
                      onChange={this.onUserInput.bind(this)}
                      fullWidth
                      autoComplete='off'
                      value={outcome.description}
                    />
                  )}
                  <Button fullWidth variant="contained" color="default" onClick={this.newOutcome.bind(this)}>Add New Outcome</Button>

                      </Grid>
                    </Grid>
                </Row>
                <hr />
        				<Row>
                    <Grid container spacing={8} alignItems="flex-end">
                      <Grid item xs={12}>
                        <Button type='submit' variant='outlined' className="button">
                          Create
                        </Button>
                      </Grid>
                    </Grid>
                </Row>
            </Col>
          </form>}
              </Container>
            );
    }
}
