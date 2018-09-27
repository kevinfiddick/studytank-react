import React from 'react'
import ax from './api';
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import ThumbsUp from '@material-ui/icons/ThumbUp'
import ReplyIcon from '@material-ui/icons/ModeComment'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar';
import { Media, Col } from 'reactstrap';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
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

export default class Comment extends React.Component {
  state = {
    email: '',
    likes: 0,
    liked: false,
    name: '',
    badge: '',
    initials: '',
    replies: [],
    replyInput: '',
    reply: false,
    commentID: '',
    id: '',
    show: false,
    now: '',
    commentators: [],
    commentID: ''
  }

  like = () => {
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
        for(var i = 0; i < note.comments.length; i++){
          if(note.comments[i].id == that.state.commentID){
            if(note.comments[i].likes.includes(that.state.email)){
              var k = note.comments[i].likes.indexOf(that.state.email);
              note.comments[i].likes.splice(k, 1);
            }else{
              note.comments[i].likes.push(that.state.email);
            }
          }
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

  likeReply = (replyID) => {
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
        for(var i = 0; i < note.comments.length; i++){
          if(note.comments[i].id == replyID){
            if(note.comments[i].likes.includes(that.state.email)){
              var k = note.comments[i].likes.indexOf(that.state.email);
              note.comments[i].likes.splice(k, 1);
            }else{
              note.comments[i].likes.push(that.state.email);
            }
          }
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

  publishReply = () => {
    if(this.state.replyInput != ''){
      var comment = {
        id: Date.now(),
        commentator: this.state.email,
        commentatorFirstname: localStorage.getItem('firstname'),
        commentatorLastname: localStorage.getItem('lastname'),
        type: 'reply',
        body: this.state.replyInput,
        date: this.state.now,
        likes: [],
        replyTo: this.state.commentID
      }
      let that = this;
        console.log('fuck');
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

          var reply = {
            id: comment.id,
            likes: 0,
            liked: false,
            name: comment.commentatorFirstname + ' ' + comment.commentatorLastname,
            type: 'reply',
            body: comment.body
          }
          var initials = reply.name.match(/\b\w/g) || [];
          initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
          reply.initials = initials;
        var replies = that.state.replies;
        replies.push(reply);
        that.setState({ replies: replies });
        that.setState({ replyInput: '' });
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
          this.setState({show: true});
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
             phrase: fullname + ' replied to your comment on ' + that.props.title
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

  componentWillMount(){
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

    var liked = this.props.liked;
    liked ? this.setState({ liked: liked }): this.setState({ liked: liked });
    var likes = this.props.likes;
    likes ? this.setState({ likes: likes }): null;
    var name = this.props.name;
    this.setState({ name: name });
    var badge = this.props.badge;
    badge ? this.setState({ badge: badge }): null;
    var replies = this.props.replies;
    replies ? this.setState({ replies: replies }): null;
    var allCommentators = [];
    for(var i = 0; i < replies.length; i++){
      replies[i].commentator != this.state.email ? allCommentators.push(replies[i].commentator) : null;
    }
    this.setState({ commentators: allCommentators });

    this.setState({ email: localStorage.getItem('email')});
    this.setState({ commentID: this.props.commentID });

    var initials = name.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    this.setState({ initials: initials });
  }

  render() {
  return (
    <div>
    <Grid container spacing={24}>
    <Grid item xs={12}>
      <Paper elevation={4} style={{padding: '15px', margin: '10px'}}>

        <Media>
          <Media left>
            <Avatar>{this.state.initials}</Avatar>
          </Media>
          <Media body style={{marginLeft: '10px'}}>
            <Media heading>
              {this.state.name}
              <MuiThemeProvider theme={theme}>
              {this.state.badge == "comment" && <Chip style={{position: 'relative', left:'15px', bottom: '5px'}} label="Comment" color='default' />}
              {this.state.badge == "suggestion" && <Chip style={{position: 'relative', left:'15px', bottom: '5px'}} label="Suggestion" color='secondary' />}
              {this.state.badge == "question" && <Chip style={{position: 'relative', left:'15px', bottom: '5px'}} label="Question" color='primary' />}
              </MuiThemeProvider>
            </Media>
              {this.props.children}
              <hr />
          </Media>
        </Media>

          <Button color={this.state.liked ? 'primary' : 'default'} onClick={e => {
              var likes = this.state.likes;
              this.state.liked ?
              likes--:
              likes++;
              this.setState({likes: likes});
              this.setState({liked: !this.state.liked});
              this.like();
            }}><span><ThumbsUp />{this.state.liked ? ' Liked' : ' Like'}</span></Button>
          <span>{this.state.likes + ' Likes'} </span>
          {this.state.replies.length > 0 && <Button color={this.state.show ? 'primary' :'default'} onClick={e => {
              this.setState({show: !this.state.show})
            }}><span><ReplyIcon />{' '+this.state.replies.length + ' Replies'}</span></Button>
          }
          {this.state.replies.length == 0 && <Button color={this.state.reply ? 'primary' :'default'} onClick={e => {
              this.setState({reply: !this.state.reply})
            }}><span><ReplyIcon />{' Reply'}</span></Button>
          }
      </Paper>
    </Grid>
    <Col xs={{size: 11, offset: 1}}>
    {this.state.show && <div>
      {this.state.replies.map((reply, i) =>
        <Grid key={reply.id} item xs={12}>
        <Paper elevation={3} style={{padding: '15px', margin: '10px'}}>
          <Media>
            <Media left>
              <Avatar>{reply.initials}</Avatar>
            </Media>
            <Media body style={{marginLeft: '10px'}}>
              <Media heading>
                {reply.name}
              </Media>
                {reply.body}
                <hr />
            </Media>
          </Media>

            <Button color={reply.liked ? 'primary' : 'default'} onClick={e => {
                  var likes = this.state.replies[i].likes;
                  reply.liked ?
                  likes-- :
                  likes++;
                  var replies = this.state.replies;
                  replies[i].likes = likes;
                  replies[i].liked = !replies[i].liked;
                  this.setState({replies: replies});
                  this.likeReply(reply.id);
              }}><span><ThumbsUp />{reply.liked ? ' Liked' : ' Like'}</span></Button>
            <span>{reply.likes + ' Likes'} </span>
            <Button color={this.state.reply ? 'primary' :'default'} onClick={e => {
                this.setState({reply: !this.state.reply})
              }}><span><ReplyIcon />{' Reply'}</span></Button>
        </Paper>
      </Grid>)}
    </div>}
      {this.state.reply && <div><TextField
        value={this.state.replyInput}
        onChange={e => {
          this.setState({replyInput: e.target.value});
        }
        }
        fullWidth
        multiline
        rows="2"
        label="Leave a Reply"
        margin="normal"
        variant="filled"
        autoFocus
      />
    <Button variant='contained' style={{marginRight: '6px'}}
      onClick={this.publishReply.bind(this)}
    > Reply </Button></div>}
    </Col>
    </Grid></div>
  );}
}
