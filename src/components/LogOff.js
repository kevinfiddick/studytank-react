import React from 'react';
import Button from '@material-ui/core/Button';
import {Container, Row, Col} from "reactstrap";
import {Link} from 'react-router-dom';
import NewGroupIcon from "@material-ui/icons/GroupAdd";
import NewNoteIcon from "@material-ui/icons/NoteAdd";
import FAQIcon from "@material-ui/icons/HelpOutline";
import "./Link.css";

const smallFont = { fontSize: '12px' };

export default class LogOff extends React.Component {
	logOff = (e) => {
		localStorage.clear();
		window.location.replace("/");
	}
	render() {
		return (
			<Container>
				<br/>
			<Row>
				<Col md={{ size: 4, offset: 2 }} xs={{ size: 6, offset: 0 }}>
			      <Button
			        variant="contained"
			        color="default"
							fullWidth
							className="darklink"
							component={Link}
							to='/dashboard/notes'
			      >
						Cancel
			      </Button>
				</Col>
				<Col md={{ size: 4, offset: 0 }} xs={{ size: 6, offset: 0 }}>
			      <Button
			        variant="contained"
			        color="primary"
							fullWidth
							className="lightlink"
							onClick={this.logOff}
			      >
						Log Off
			      </Button>
				</Col>
			</Row>
			</Container>
		);
	}
}
