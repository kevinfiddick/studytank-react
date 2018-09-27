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
import {Container, Row, Col, Alert} from 'reactstrap'
import BookmarkedIcon from "@material-ui/icons/BookmarkBorder";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import AddToGroupIcon from "@material-ui/icons/GroupAdd";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import OpenIcon from '@material-ui/icons/GetApp';
import {Link} from 'react-router-dom';
import './Link.css';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Comment from './Comment'

const theme = createMuiTheme({
  palette: {
	   primary: {
       light: '#FFEE58',
       main: '#FFEB3B',
       dark: '#FDD835',
       contrastText: '#000',
	   },
	   secondary: {
	     light: '#00796B',
	     main: '#FF6F00',
	     dark: '#E65100',
	     contrastText: '#fff',
	   }
  }
});

const badges = createMuiTheme({
  palette: {
      primary: {
         light: '#FFEE58',
         main: '#FFEB3B',
         dark: '#FDD835',
         contrastText: '#000',
      },
	   secondary: {
	     light: '#43A047',
	     main: '#388E3C',
	     dark: '#2E7D32',
	     contrastText: '#fff'
	   }
  }
});

class Note extends Component {
  state = {
    email: '',
    comments: [],
    commentInput: '',
    now: '',
    success: false,
    author: ''
  };

  leaveComment(e){
    this.publishComment('comment');
  }
  leaveQuestion(e){
    this.publishComment('question');
  }
  leaveSuggestion(e){
    this.publishComment('suggestion');
  }

  publishComment = (type) => {
    if(this.state.commentInput != ''){
      var comment = {
        id: Date.now(),
        commentator: this.state.email,
        commentatorFirstname: localStorage.getItem('firstname'),
        commentatorLastname: localStorage.getItem('lastname'),
        type: type,
        body: this.state.commentInput,
        date: this.state.now,
        likes: [],
        replyTo: 0
      }
      let that = this;
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
        note.comments.push(comment);
        that.setComments(note.comments);
        that.setState({ commentInput: '' });
        that.setState({ author: note.author });
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
          that.setState({ success: true });
          notifyCommentators();
        });
      });

      var b = 0;
      var fullname = localStorage.getItem('firstname') + ' ' + localStorage.getItem('lastname');
      const notifyCommentators = () => {
       if(b < that.state.commentators.length) {
         ax.get('/' + 'user' + '/' + that.state.commentators[b] )
         .then(rs => {
           var user = rs.data;
           if(!user.hasOwnProperty('username')){
             user.username =
               user.firstname.trim().replace(/\s/g,'-').toLowerCase() + '-' + user.lastname.trim().replace(/\s/g,'-').toLowerCase();
           }
           user.notifications.push({
             id: Date.now(),
             seen: false,
             page: "note",
             linkID: that.props.id,
             phrase: fullname + ' also commented on ' + that.props.title
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
             b++;
             notifyCommentators();
           });
         });
       }
     }
   }
  }

  setComments = (comments) => {
    var stateComments = [];
    var allCommentators = [];
    allCommentators.push(this.state.author);
    for(var i = 0; i < comments.length; i++){
      var likes = comments[i].likes.length;
      likes == undefined ? likes = 0: null;
      if(comments[i].replyTo == 0){
        var comment = {
          id: comments[i].id,
          likes: likes,
          liked: comments[i].likes.includes(this.state.email),
          name: comments[i].commentatorFirstname + ' ' + comments[i].commentatorLastname,
          type: comments[i].type,
          body: comments[i].body,
          replies: []
        }
        stateComments.push(comment);
        if(comments[i].commentator != this.state.email && !allCommentators.includes(comments[i].commentator)){
          allCommentators.push(comments[i].commentator);
        }
      }
      else{
        var reply = {
          id: comments[i].id,
          likes: likes,
          liked: comments[i].likes.includes(this.state.email),
          name: comments[i].commentatorFirstname + ' ' + comments[i].commentatorLastname,
          type: 'reply',
          body: comments[i].body,
          replyTo: comments[i].replyTo,
          commentator: comments[i].commentator
        }
        var initials = reply.name.match(/\b\w/g) || [];
        initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
        reply.initials = initials;
        for(var j = 0; j < stateComments.length; j++){
          reply.replyTo == stateComments[j].id ?
          stateComments[j].replies.push(reply) :
          null;
        }
      }
    }
    this.setState({ comments: stateComments });
    this.setState({ commentators: allCommentators });

  }

  componentDidMount(){
    const email = localStorage.getItem('email') || '';
    this.setState({ email: email });
    var now = new Date();
    var month = (now.getMonth() + 1);
    var day = now.getDate();
    var hour = now.getHours();
    var min = now.getMinutes();
    if(month < 10)
        month = "0" + month;
    if(day < 10)
        day = "0" + day;
    if(min < 10)
        min = "0" + min;
    var today = now.getFullYear() + '-' + month + '-' + day;
    var curTime = today + " @ " + hour + ":" + min;
    this.setState({ now: curTime });

    let that = this;
    ax.get('/' + 'note' + '/' + this.props.id )
    .then(res => {
      var note = res.data;
      that.setComments(note.comments);
    });
  }

  render() {
    return(
    <div>
      {this.state.success && <Alert color="success">
        Successfully Posted!
      </Alert>}
      {this.state.email != '' && <div>
        <TextField
          value={this.state.commentInput}
          onChange={e =>
            this.setState({commentInput: e.target.value})
          }
          fullWidth
          multiline
          rows="4"
          label="Leave Comment, Question, or Suggestion"
          margin="normal"
          variant="filled"
        />
      <MuiThemeProvider theme={badges}>
      <Button variant='contained' style={{marginRight: '6px'}} onClick={this.leaveComment.bind(this)}> Comment</Button>
      <Button variant='contained' style={{marginRight: '6px'}} color='primary' onClick={this.leaveQuestion.bind(this)}> Question</Button>
      <Button variant='contained' style={{marginRight: '6px'}} color='secondary' onClick={this.leaveSuggestion.bind(this)}> Suggestion</Button>
      </MuiThemeProvider>
    </div>}
        <hr />
      {this.state.comments.length == 0 && <Typography variant='headline'> No Comments to Show</Typography>}
      {this.state.comments.map(comment =>
        <div key={comment.id}>
          <Comment
            id={this.props.id}
            commentID={comment.id}
            likes={comment.likes}
            liked={comment.liked}
            name={comment.name}
            badge={comment.type}
            replies={comment.replies}
            title={this.props.title}
          >
            {comment.body}
          </Comment>

        </div>
      )}
    </div>
    )
  }
}
export default Note;
