import React, { Component } from "react";
import ReactStars from 'react-stars'
import ReactDOM from 'react-dom'
import ReactMarkdown from 'react-markdown'
import Typography from '@material-ui/core/Typography'
import ax from './api';
import ConfirmationModal from './ConfirmationModal';
import LanguageSelector from './LanguageSelector';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import {Container, Row, Col} from 'reactstrap'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import './Link.css';
import './Form.css';
import Autosaving from "./Autosaving";
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField'
import SimpleMDEReact from "react-simplemde-editor";
import "simplemde/dist/simplemde.min.css";

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
    id: Date.now(),
    email: '',
    author: '',
    authorFirstname: '',
    authorLastname: '',
    title: '',
    content: '',
    subject: '',
    school: '',
    date: '',
    isFact: true,
    language: 'EN',
    textbook: '',
    uploadStatus: 'Upload'
  };

  isFactChange(e){
      this.setState({ isFact: e.target.checked});
  }

  onContentChange = (e) => {
      this.setState({ content: e });
  }

  onChange = (e) => {
      this.setState({ [e.target.id]: e.target.value });
  }

  upload(e){
    this.setState({uploadStatus: <span>Uploading... <CircularProgress /></span>});
    if(this.props.id){
      ax.get('/' + 'note' + '/' + this.props.id).then(result => {
        var note = result.data.value;
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
            window.location.replace("/note/"+note.id);
        });
      });
    }
    else{
      var note = this.state;
      ax({
         method: 'put',
         url: '/note/' + note.id,
         data: {
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
           saved: [],
           folder: {},
           comments: [],
           rating: {}
         }
      }).then(res => {
          window.location.replace("/note/"+note.id);
      });
    }
  }

  componentDidMount(){
    const email = localStorage.getItem('email');
    this.setState({ email: email });
    this.setState({ author: email });
    const firstname = localStorage.getItem('firstname');
    const lastname = localStorage.getItem('lastname');
    const school = localStorage.getItem('school');
    this.setState({ authorFirstname: firstname });
    this.setState({ authorLastname: lastname });
    this.setState({ school: school });
    var today;
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
    today = now.getFullYear() + '-' + month + '-' + day;
    this.setState({  date: today });

    if(this.props.id){
      this.setState({ id: this.props.id });
      let that = this;
        ax.get('/' + 'note' + '/' + this.props.id).then(result => {
          var note = result.data;
          console.log(note);
          that.setState({ title: note.title });
          that.setState({ subject: note.subject });
          that.setState({ content: note.content });
          that.setState({ school: note.school });
          that.setState({ isFact: note.isFact });
          that.setState({ language: note.language });
          that.setState({ textbook: note.textbook });
            console.log(that.state);

        }).then(res => {
          console.log(that.state);
        });
    }
  }

  render() {
    return(
    <div>
      <Container>
        <Col xs={{ size: 12 }}>
        <br />
          <Row>
            <Typography  variant='display1' style={{position: 'relative', left: '10px'}}>
                Upload Note
            </Typography>
          </Row>
            <Row>
              <Col xs={{ size: 12 }}>
              <TextField
                required
                id='title'
                value={this.state.title}
                error={this.state.title == ''}
                onChange={this.onChange.bind(this)}
                label='Note Title'
                margin='normal'
                fullWidth
              />
            </Col>
            </Row>
          <hr />
          <br />
            <Autosaving value={this.state.content} onChange={this.onContentChange.bind(this)} />
          <br />
              <ConfirmationModal
                disabled={this.state.title.length == 0}
                modalHeader="Finishing Touches..."
                message=
                {<div>
                    <TextField
                      required
                      id='subject'
                      value={this.state.subject}
                      onChange={this.onChange.bind(this)}
                      label='Subject'
                      margin='normal'
                      fullWidth
                    />
                    <TextField
                      id='school'
                      value={this.state.school}
                      onChange={this.onChange.bind(this)}
                      label='School'
                      margin='normal'
                      fullWidth
                    />
                    <TextField
                      id='textbook'
                      value={this.state.textbook}
                      onChange={this.onChange.bind(this)}
                      label='Textbook or Reference'
                      margin='normal'
                      fullWidth
                    />
                    <TextField
                      id='language'
                      value={this.state.language}
                      onChange={this.onChange.bind(this)}
                      label='Language'
                      margin='normal'
                      fullWidth
                    />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={this.state.isFact}
                        onChange={this.isFactChange.bind(this)}
                        color="primary"
                      />
                    }
                    label="Factual"
                  />
                </div>}
                onClick={this.upload.bind(this)}
                confirm={this.state.uploadStatus}
              >

              <Button
                variant="contained"
                color="primary"
                className="wide"
              >
                    Finish
              </Button>
              <br/>
              <br/>
          </ConfirmationModal>
    	  </Col>
      </Container>
    </div>
    )
  }
}
export default Note;
