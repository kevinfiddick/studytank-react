import React from 'react';
import Button from '@material-ui/core/Button';
import {Container, Row, Col} from "reactstrap";
import {Link} from 'react-router-dom';
import NewGroupIcon from "@material-ui/icons/GroupAdd";
import NewNoteIcon from "@material-ui/icons/NoteAdd";
import FAQIcon from "@material-ui/icons/HelpOutline";
import "./Link.css";

export default class NewCourseButton extends React.Component {

	state = {
		email: ''
	}

	componentWillMount(){
			var email = localStorage.getItem("email");
      this.setState({email: email});
	}

	render() {
		return (
			<Container>
				{(this.state.email == 'kevinfiddick@studytank.com' || this.state.email == 'tyler@studytank.com') &&
			<Row>
				<Col md={{ size: 8, offset: 2 }} xs={{ size: 12, offset: 0 }}>
					<br/>
			      <Button
			        variant="contained"
			        color={this.props.color}
							fullWidth
							component={Link}
							to={this.props.linkTo}
							className="lightlink"
			      >
			      <span style={{paddingLeft: 10}} > {this.props.label} </span>
			      </Button>
				</Col>
			</Row>
				}
			</Container>
		);
	}
}
