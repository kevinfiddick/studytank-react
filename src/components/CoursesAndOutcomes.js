import React, { Component } from "react";
import ReactStars from 'react-stars'
import ReactDOM from 'react-dom'
import ReactMarkdown from 'react-markdown'
import Typography from '@material-ui/core/Typography'
import ax from './api';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import OpenIcon from '@material-ui/icons/GetApp';
import {Link} from 'react-router-dom';
import './Link.css';

export default class CoursesAndOutcomes extends Component {
  state = {
    email: '',
    author: true,
    exclusive: false,
    courses: [],
    outcomes: [],
    selected: {}
  };
  /**
  course = {
  id:
  title:
  course:
  professor:
  outcomes:
  }
  */
  /**
  outcome = {
  id:
  description:
  course:
  }
  */
  /**
  selected = {
  courseID: [outcomeIDs]
  }
  */
  onCourse(e){
    var courseID = e.target.value;
    var courses = [];
    courses = courses.concat(this.state.courses);
    var course = courses.find(function(course){
      return course.id == courseID;
    });

    var selected = this.state.selected;
    selected.hasOwnProperty(course.id) ?
    delete selected[course.id]:
    selected[course.id] = [];
    this.setState({selected: selected});

    var outcomes = [];
    outcomes = outcomes.concat(this.state.outcomes);
    if(!selected.hasOwnProperty(course.id)){
      outcomes = outcomes.filter(function(outcome){
        return outcome.course != courseID;
      });
    }
    else{
      outcomes = outcomes.concat(course.outcomes);
    }
    this.setState({outcomes: outcomes});

    this.props.selection(selected);

  }

  onOutcome(e){
    var outcomeID = e.target.value;
    var outcomes = [];
    outcomes = outcomes.concat(this.state.outcomes);
    var outcome = outcomes.find(function(outcome){
      return outcome.id == outcomeID;
    });
    var courseID = outcome.course;
    var selected = this.state.selected;
    var index = selected[courseID].findIndex(function(o){
      return o == outcomeID;
    });
    index >= 0 ?
    selected[courseID].splice(index, 1) :
    selected[courseID].push(outcomeID);
    this.setState({selected: selected});
    this.props.selection(selected);

  }

  updateOutcomes(){
    var selected = this.state.selected;
    for(var courseID in selected){
      var courses = [];
      courses = courses.concat(this.state.courses);
      var course = courses.find(function(course){
        return course.id == courseID;
      });
      var outcomes = course.outcomes.concat(this.state.outcomes);
      this.setState({outcomes: outcomes});
    }
  }

  exclusive(e){
    var ex = e.target.checked;
    this.setState({exclusive: ex});
    this.props.exclusive(ex);

  }

  componentDidMount(){
    const email = localStorage.getItem('email') || '';
    this.setState({ email: email });
    let that = this;
    ax.get('/' + 'course' + '/_design/members/_view/' + 'admins' + '?key=\"' + email + '\"')
    .then(res => {
        var rows = res.data.rows;
        var courses = rows.map(a => a.value);
        that.setState({ courses: courses });
        if(this.props.courses && (this.props.id == '' || this.props.id == null) ){
          this.setState({selected: this.props.courses});
          that.updateOutcomes();
        }
        if(courses.length > 0){
        if(this.props.id != '' && this.props.id != null ){
          ax.get('/' + 'note' + '/' + this.props.id )
          .then(res => {
            var note = res.data;
            if(note.exclusive == undefined) note.exclusive = false;
            if(note.courses == undefined) note.courses = {};
            var author = note.author == email;
            that.setState({ author: author });
            that.setState({ exclusive: note.exclusive});
            that.setState({ selected: note.courses});
            that.updateOutcomes();
          });
        }
        }

    });
  }

  render() {
    return(
    <div>
    {this.state.courses.length > 0 &&
      <hr />}
      {this.state.courses.length > 0 &&
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant='title'>Courses & Outcomes</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
      <Grid container spacing={12}>
        <Grid item xs={12}>
          {this.state.author && <FormControlLabel
            control={
              <Switch
                checked={this.state.exclusive}
                onChange={this.exclusive.bind(this)}
                color="primary"
              />
            }
            label="Private"
          />}
        </Grid>
        <Grid item xs={12}>
              <Typography variant='subheading'>
                Courses
              </Typography>
            </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  {this.state.courses.map(course =>
                  <div key={course.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={this.state.selected.hasOwnProperty(course.id)}
                        onChange={this.onCourse.bind(this)}
                        value={course.id}
                      />
                    }
                    label={course.title + ' (' + course.course + ' with ' + course.professor + ')'}
                    />
                    </div>
                  )}
                </FormGroup>
              </Grid>
                <Grid item xs={12}>
                  <Typography variant='subheading'>
                    Outcomes
                  </Typography>
                </Grid>
                  <Grid item xs={12}>
                    <FormGroup>
                      {this.state.outcomes.map(outcome =>
                      <div key={outcome.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="primary"
                            checked={this.state.selected[outcome.course].includes(outcome.id)}
                            onChange={this.onOutcome.bind(this)}
                            value={outcome.id}
                          />
                        }
                        label={outcome.description}
                        />
                      </div>
                      )}
                    </FormGroup>
                  </Grid>
                </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>}
    </div>
    )
  }
}
