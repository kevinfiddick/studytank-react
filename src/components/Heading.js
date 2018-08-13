import React from 'react';
import {Container, Row, Col} from "reactstrap";
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';

export default class Heading extends React.Component {
	render() {
		return (
			<Container>
			<Row>
				<Col md={{ size: 8, offset: 2 }} xs={{ size: 12, offset: 0 }}>
					<br/>
					<Typography variant="display1" gutterBottom>
						{this.props.children}
      		</Typography>
				</Col>
			</Row>
			</Container>
		);
	}
}
