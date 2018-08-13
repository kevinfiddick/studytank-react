import React from 'react';
import Button from '@material-ui/core/Button';
import {Container, Row, Col} from "reactstrap";
import {Link} from 'react-router-dom';
import NewGroupIcon from "@material-ui/icons/GroupAdd";
import NewNoteIcon from "@material-ui/icons/NoteAdd";
import FAQIcon from "@material-ui/icons/HelpOutline";
import "./Link.css";

export default class DashboardButton extends React.Component {
	render() {
		return (
			<Container>
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
						{this.props.linkTo === '/create/group' && <NewGroupIcon />}
						{this.props.linkTo === '/create/note' && <NewNoteIcon />}
						{this.props.linkTo === '/faq' && <FAQIcon />}
			      <span style={{paddingLeft: 10}} > {this.props.label} </span>
			      </Button>
				</Col>
			</Row>
			</Container>
		);
	}
}
