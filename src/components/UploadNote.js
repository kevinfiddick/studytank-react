import React, { Component } from "react";
import ReactStars from 'react-stars'
import ReactDOM from 'react-dom'
import ReactMarkdown from 'react-markdown'
import Typography from '@material-ui/core/Typography'
import ax from './api';
import ConfirmationModal from './ConfirmationModal';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {Container, Row, Col} from 'reactstrap'
import BookmarkedIcon from "@material-ui/icons/BookmarkBorder";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import AddToGroupIcon from "@material-ui/icons/GroupAdd";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import {Link} from 'react-router-dom';
import './Link.css';
import Autosaving from "./Autosaving";

const theme = createMuiTheme({
  palette: {
	   primary: {
       light: '#757575',
       main: '#616161',
       dark: '#424242',
       contrastText: '#fff',
	   },
	   secondary: {
	     light: '#00796B',
	     main: '#FF6F00',
	     dark: '#E65100',
	     contrastText: '#fff',
	   }
  }
});

class Note extends Component {
  state = {
    email: '',
    author: false,
    bookmarked: false,
    rating: '',
    title: '',
    content: '',
    myGroups: [],
    info: [],
    comments: [],
    commentInput: '',
    shareGroupSelect: '',
    shareStatus: 'Share'
  };

  onShareWithGroup(e){
    if(this.state.shareGroupSelect != ''){
      this.setState({shareStatus: <span>Sharing... <CircularProgress /></span>});
      var group = this.state.shareGroupSelect;
        ax.get('/' + 'note' + '/' + this.props.id).then(result => {
          var note = result.data.value;
          note.folder == undefined ? note.folder = {} : null;
          note.folder[group] = group;
          if(!note.saved.includes(group)){
            note.saved.push(group);
          }
          //Converts note ratings to JSON
          if(Object.prototype.toString.call(note.rating) === "[object Array]"){
            var newrating = {};
            for(var j = 0; j < note.rating.length; j++){
              newrating[note.rating[j].uniqueID] = note.rating[j].rating;
            }
            note.rating = newrating;
          }
          ax({
             method: 'post',
             url: '/note',
             data: {
               _id: note._id,
               _rev: note._rev,
               title: note.title,
               content: note.content,
               author: note.author,
               authorFirstname: note.authorFirstname,
               authorLastname: note.authorLastname,
               subject: note.subject,
               school: note.school,
               date: note.date,
               isFact: note.isFact,
               language: note.language,
               textbook: note.textbook,
               saved: note.saved,
               folder: note.folder,
               comments: note.comments,
               rating: note.rating,
               _attachments:note._attachments
             }
          }).then(res => {
          });
        });
    }
  }

  onShareGroupSelected(e){
    this.setState({ shareGroupSelect: e.target.id.toLowerCase()});
  }

  ratingChanged(r){
    ax.get('/' + 'note' + '/' + this.props.id )
    .then(res => {
      var note = res.data;
      if(Object.prototype.toString.call(note.rating) === "[object Array]"){
        var newrating = {};
        for(var j = 0; j < note.rating.length; j++){
          newrating[note.rating[j].uniqueID] = note.rating[j].rating;
        }
        note.rating = newrating;
      }
      note.rating[this.state.email] = r;
      ax({
         method: 'post',
         url: '/note',
         data: {
           _id: note._id,
           _rev: note._rev,
           title: note.title,
           content: note.content,
           author: note.author,
           authorFirstname: note.authorFirstname,
           authorLastname: note.authorLastname,
           subject: note.subject,
           school: note.school,
           date: note.date,
           isFact: note.isFact,
           language: note.language,
           textbook: note.textbook,
           saved: note.saved,
           folder: note.folder,
           comments: note.comments,
           rating: note.rating,
           _attachments:note._attachments
         }
      }).then(res => {
      });
    });
  }

  componentDidMount(){
    const email = localStorage.getItem('email') || '';
    this.setState({ email: email });
    let that = this;
    ax.get('/' + 'note' + '/' + this.props.id )
    .then(res => {
      var note = res.data;
      console.log(note);
      var bookmarked = note.saved.includes(email);;
      var rating = '';
      var info = [];
      var numberRating;
      var author = false;

      if(note.rating.hasOwnProperty(this.state.email)){
          numberRating = note.rating[this.state.email];
      }
      else{
        var sum = 0;
        var total = 0;
        for (var key in note.rating) {
          if (note.rating.hasOwnProperty(key)) {
              var rating = note.rating[key];
              sum += rating;
              total += 1;
          }
        }
        total > 0 ?
        numberRating = sum/total:
        numberRating = 0;
      }
      rating = Math.round(numberRating);
      var author = 'Author: ' + note.authorFirstname + ' ' + note.authorLastname;
      var subject = 'Subject: ' + note.subject;
      var uploadDate = 'Date Created: ' + note.date;
      var school;
      note.school == '' ? school = 'School: none' : school = 'School: ' + note.school;
      var isFact;
      note.isFact ? isFact = 'Factual' : isFact = 'Opinion';
      var reference;
      note.textbook == '' ? reference = 'No References Listed' : reference = 'Reference: ' + note.textbook;
      info = [author, subject, uploadDate, school, isFact, reference];
      author = note.author == email;
      that.setState({ author: author });
      that.setState({ title: note.title });
      that.setState({ content: note.content });
      that.setState({ comments: note.comments });
      that.setState({ bookmarked: bookmarked });
      that.setState({ rating: rating });
      that.setState({ info: info });

      ax.get('/' + 'group' + '/_design/dashboard/_view/' + 'mygroups' + '?key=\"' + email + '\"')
      .then(res => {
          console.log(res.data.rows);
          const groupsArray = res.data.rows;
          that.setState({ myGroups: groupsArray });
      });
    });
  }

  render() {
    return(
    <div>
      <Container>
        <Col xs={{ size: 12 }}>
          <Row>
            <Typography  variant='display1' style={{position: 'relative', left: '10px'}}>
                Upload Note
            </Typography>
          </Row>
          <br />
            <Row>
              <TextField
                required
                id='title'
                onChange={this.onChange}
                label='Note Title'
                margin='normal'
                fullWidth
                required
              />
            </Row>
          <hr />
          <br />
            <Autosaving id="content" />
          <br />
    	  </Col>
      </Container>
    </div>
    )
  }
}
export default Note;
