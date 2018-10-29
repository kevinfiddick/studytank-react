/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import ax from './api';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import './FilterList.css';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import { sha256 } from './Encoder';

export default class LearningOutcomeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      selected: [],
      outcomes: [],
      newOutcomes: [],
      courseID: '',
      edit: false
    };
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  enableEdit(){
    var outcomes = [];
    outcomes = outcomes.concat(this.state.outcomes);
    outcomes.push({
      id: ((Date.now() + Math.random() + 1) * 10000).toString(),
      description: ''
    });
    this.setState({
      newOutcomes: outcomes
    });
    this.setState({ edit: true });
  }

  cancelEdit(){
    this.setState({ newOutcomes: [] });
    this.setState({ edit: false });
    this.setState({ modal: false });
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

  saveChanges(){
    ax.get('/' + 'course' + '/' + this.state.courseID )
    .then(res => {
        var course = res.data;
        var newOutcomes = this.state.newOutcomes;
        var outcomes = [];
        for(var i = 0; i < newOutcomes.length; i++){
          var outcome = newOutcomes[i];
          if(outcome.description != ''){
            outcomes.push(outcome);
          }
        }
        course.outcomes = outcomes;
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
              window.location.reload();
            });
    });
  }

  select(e){
    var selected = this.state.selected;
    var outcomeID = e.target.value;
    selected.includes(outcomeID) ?
    selected.splice(selected.indexOf(outcomeID), 1) :
    selected.push(outcomeID);
    this.setState({ selected: selected });
    this.props.selectedIDs(selected);
  }

  componentWillMount(){
    var outcomes = [];
    outcomes = outcomes.concat(this.props.outcomes);
    this.setState({ outcomes: outcomes });
    this.setState({ courseID: this.props.courseID });

  }

  render() {
    return (
      <span>
        <span onClick={this.toggle.bind(this)}>{this.props.children}</span>
        <Modal isOpen={this.state.modal} toggle={this.toggle.bind(this)}>
          <ModalHeader toggle={this.toggle.bind(this)}>Learning Outcomes</ModalHeader>
          <ModalBody>
          {!this.state.edit &&
          <div>
            {this.props.admin && <div>
              <Button
                fullWidth
                variant="contained"
                color="default"
                onClick={this.enableEdit.bind(this)}
              >
                Edit Outcomes
              </Button>
              <hr/>
            </div>}
            {this.state.outcomes.length > 0 &&
              <div>
            <Typography>What Do You Need to Study?</Typography>
              <FormGroup>
                {this.state.outcomes.map(outcome =>
                <FormControlLabel
                  key={outcome.id}
                  control={
                    <Checkbox
                      color="primary"
                      checked={this.state.selected.includes(outcome.id)}
                      onChange={this.select.bind(this)}
                      value={outcome.id}
                    />
                  }
                  label={outcome.description}
                  />
                )}
              </FormGroup>
            </div>}
          </div>
          }

          {(this.state.edit && this.props.admin) &&
          <div>
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
            <Button color="default" onClick={this.newOutcome.bind(this)}>Add New Outcome</Button>
          </div>
          }
          </ModalBody>
          <ModalFooter>
            {!this.state.edit && <Button variant="outlined" color="primary" onClick={this.toggle.bind(this)}>Done</Button>}
            {this.state.edit && <span>
              <Button color="default" onClick={this.cancelEdit.bind(this)}>Cancel</Button>
              <Button variant="contained" color="primary" onClick={this.saveChanges.bind(this)}>Save Changes</Button>
            </span>}
          </ModalFooter>
        </Modal>
      </span>
    );
  }
}
