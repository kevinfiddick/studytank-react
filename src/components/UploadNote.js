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
import SimpleMDE from "./Simple";
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField'
import SimpleMDEReact from "react-simplemde-editor";
import "simplemde/dist/simplemde.min.css";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ClearIcon from '@material-ui/icons/Clear';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

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

export default class Note extends React.Component {
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
    uploadStatus: 'Upload',
    edit: false,
    attachments: [],
    deleted: [],
    files: [],
    uploadingAttachments: false,
    progress: []
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

  handleFiles(files){
    delete files.length;
    var filesArray = Object.values(files);
    this.setState({ files: filesArray });

  }

  addAttachments = () => {
    var progress = [];
    var files = this.state.files;
    var deleteIDs = this.state.deleted;

    for(var j = 0; j < files.length; j++){
      progress[j] = {
        name: files[j].name,
        percent: 0
      };
    }
    this.setState({progress: progress});
    this.setState({uploadingAttachments: true});

    var i = 0;

    let that = this;
    const detach = () => {
      if(deleteIDs.length > 0){
        ax.get('/' + 'note' + '/' + this.props.id).then(result => {
          var note = result.data;
          if(Object.prototype.toString.call(note.rating) === "[object Array]"){
            var newrating = {};
            for(var j = 0; j < note.rating.length; j++){
              newrating[note.rating[j].uniqueID] = note.rating[j].rating;
            }
            note.rating = newrating;
          }
          for(var k = 0; k < deleteIDs.length; k++){
            var deleteID = deleteIDs[k];
            delete note._attachments[deleteID];
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
            if(files.length > 0){
              attach(files[i]);
            }else{
              window.location.replace("/note/"+note.id);
            }
          });
        });
      }
      else{
        attach(files[i]);
      }
    }

    const attach = (file) => {
      var name = encodeURIComponent(file.name);
      var type = file.type;
      var fileReader = new FileReader();

      fileReader.readAsArrayBuffer(file);
      fileReader.onload = function (readerEvent) {

        ax.get('/' + 'note' + '/' + that.state.id).then(result => {
          var note = result.data;
          ax({
           method: 'put',
           url: '/note/'+note._id+'/'+name+'?rev='+note._rev,
           headers: {'Content-Type': type},
           data: file,
           onUploadProgress: function (progressEvent) {
             if(progressEvent.lengthComputable){
               var percent = (progressEvent.loaded / progressEvent.total) * 100;
               var progress = that.state.progress;
               progress[i].percent = percent;
               that.setState({progress: progress});
             }
           },
          }).then(res => {
              i++;
              if(i < files.length){
                attach(files[i]);
              }
              else{
                window.location.replace("/note/"+note._id);
              }

          }).catch(err => {
          });
        });
      }
    }

    detach();
  }

  upload(e){
    this.setState({uploadStatus: <span>Uploading... <CircularProgress /></span>});
    if(this.props.id){
      ax.get('/' + 'note' + '/' + this.props.id).then(result => {
        var note = result.data;
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
          if((this.state.files.length > 0) || (this.state.deleted.length > 0)){
            this.addAttachments();
          }else{
            window.location.replace("/note/"+note.id);
          }
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
          if((this.state.files.length > 0) || (this.state.deleted.length > 0)){
            this.addAttachments();
          }else{
            window.location.replace("/note/"+note.id);
          }
      });
    }
  }

  componentWillMount(){
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
          that.setState({ title: note.title });
          that.setState({ subject: note.subject });
          that.setState({ content: note.content });
          that.setState({ school: note.school });
          that.setState({ isFact: note.isFact });
          that.setState({ language: note.language });
          that.setState({ textbook: note.textbook });
          that.setState({ edit: true });
          if(note._attachments){
            var attachments = Object.keys(note._attachments);
            if(attachments.length > 0){
              that.setState({ attachments: attachments });
            }
          }
        }).then(res => {
        });
    }
  }

  render() {
    return(
    <div>
      {!this.state.uploadingAttachments &&
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
        <input multiple type="file" style={{position: 'relative', width: '300px', height: '40px', opacity: 0, zIndex: 2}} onChange={ (e) => this.handleFiles(e.target.files) } />
        <Button
          style={{position: 'absolute', left: '15px', width: '300px', zIndex: 1}}
          variant="contained" color="default"
        >
           <span><CloudUploadIcon /><span style={{marginLeft: '5px'}}>{'  Upload Attachments '}</span></span>
        </Button>
          <br />

        {(this.state.files.length > 0 || this.state.attachments.length > 0) &&
          <div style={{margin: '10px'}}>
        {this.state.attachments.map((file, i) =>
          <span key={file} style={{display: 'inline-block', marginRight: '5px', marginTop: '5px'}}>
            <ConfirmationModal
              modalHeader="Perminantly Delete?"
              message=
              {<div>
                <Typography>Are you sure you want to perminantly delete this attachment?</Typography>
                <Typography>This change cannot be undone.</Typography>
              </div>
              }
              onClick={e => {
                var attachments = this.state.attachments;
                var deleted = attachments.splice(i, 1);
                deleted = deleted.concat(this.state.deleted);
                this.setState({ attachments: attachments });
                this.setState({ deleted: deleted });
              }}
              confirm='Delete Attachment'
            >
          <Button
            variant="contained" color="primary"
          >
             <span>{file}<span style={{marginLeft: '5px'}}><ClearIcon /></span></span>
          </Button>
          </ConfirmationModal>
          </span>
        )}
        <MuiThemeProvider theme={theme}>
        {this.state.files.map((file, i) =>
          <span key={file.name} style={{display: 'inline-block', marginRight: '5px', marginTop: '5px'}}>
          <Button
            variant="contained" color="primary"
            onClick={e => {
              var files = this.state.files;
              files.splice(i, 1);
              this.setState({ files: files });
            }}
          >
             <span>{file.name}<span style={{marginLeft: '5px'}}><ClearIcon /></span></span>
          </Button>
          </span>
        )}
        </MuiThemeProvider>

        </div>}
            <br />
          {!this.state.edit &&
            <Autosaving id='upload' onChange={this.onContentChange.bind(this)} />
          }
          {this.state.edit &&
            <SimpleMDE value={this.state.content} onChange={this.onContentChange.bind(this)} />
          }<br />
              <ConfirmationModal
                disabled={(this.state.title.length == 0) || (this.state.content.length == 0 && (this.state.files.length == 0 && this.state.attachments.length == 0))}
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
                disabled={(this.state.title.length == 0) || (this.state.content.length == 0 && (this.state.files.length == 0 && this.state.attachments.length == 0))}
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
      </Container>}
      {this.state.uploadingAttachments &&
      <Container>
        <Col md={{size: 8, offset: 2}} xs={{ size: 12 }}>
        <br />
          <Row>
            <Typography  variant='display1' style={{position: 'relative', left: '10px'}}>
                Uploading Attachments...
            </Typography>
          </Row>
          <br />
          <br />
          <Grid container spacing={24}>
          {this.state.progress.map((prog, k) =>
              <Grid item key={k} xs={12}>
                <Paper style={{margin: '2px', padding: '20px'}} >
                  <Typography variant="button">{prog.name}</Typography>
                  <LinearProgress variant="determinate" value={prog.percent} />
                  <br />
                </Paper>
              </Grid>
          )}
          </Grid>

        </Col>
      </Container>}

    </div>
    )
  }
}
