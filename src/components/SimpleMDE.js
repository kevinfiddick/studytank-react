import Autosaving from "./Autosaving";
import React from "react";
import SimpleMDEReact from "react-simplemde-editor";
import "simplemde/dist/simplemde.min.css";
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import ModalStuff from './modal'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText } from 'reactstrap'
import Tooltip from '@material-ui/core/Tooltip'

let counter = 1;

class UploadNote extends React.Component {
  state = {
    textValue1: "I am the initial value. Erase me, or try the button above.",
  };



  handleChange1 = value => {
    this.setState({
      textValue1: value
    });
  };



  render() {
    return (
      <div className="container container-narrow">
      <br />
      <Typography variant="headline" gutterBottom>
       Upload Note
     </Typography>
      <TextField
        required
        id='notetitle'
        onChange={this.onChange}
        label='Note Title'
        className="textField"
        margin='normal'
        />
        <hr />
        <FormGroup>
          <Input multiple type="file" name="file" id="uploadFile" />
          <FormText color="muted">
            Select any files to upload to this note
          </FormText>
        </FormGroup>
        <Autosaving id="demo"/>
        <ModalStuff />
      </div>
    );
  }
}

export default UploadNote;
