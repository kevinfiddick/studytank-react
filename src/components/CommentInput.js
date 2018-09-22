import React, { Component } from "react";
import { Form, FormGroup, Label, Input, FormText } from 'reactstrap'
import Typography from '@material-ui/core/Typography'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'



const theme = createMuiTheme({
  palette: {
	   primary: {
      light: '#757575',
      main: '#e6b800',
      dark: '#424242',
      contrastText: '#fff'
	   },
	   secondary: {
	     light: '#43A047',
	     main: '#388E3C',
	     dark: '#2E7D32',
	     contrastText: '#fff'
	   }
  }
})

class CommentInput extends Component {

  onComment(e){
    console.log('comment')
  }
  onSuggestion(){
    console.log('suggestion')
  }
  onQuestion(){
    console.log('question')


  }

  state = {
    type: ''
  };

  render() {
    return (
      <Form>
      <FormGroup>
      <Typography variant='headline'>
      Please Leave a Comment, Question, or Suggestion
      </Typography>
         <Input type="textarea" name="text" id="exampleText" />
       </FormGroup>
        <Button variant="contained" color="primary" onClick={this.onSuggestion}>
       Suggestion
       </Button>
       <MuiThemeProvider theme={theme}>
       <Button variant="contained" color="primary" onClick={this.onQuestion}>
  Question
      </Button>
      </MuiThemeProvider>
    <Button variant="contained" color="default" onClick={this.onComment}>
   Comment
 </Button>
       </Form>

    );
  }
}

export default CommentInput;
