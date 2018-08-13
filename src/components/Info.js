import React from 'react';
import {Container, Row, Col} from "reactstrap";
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';

export default class Info extends React.Component {
	render() {
		return (
			<Container>
			<Row>
				<Col md={{ size: 8, offset: 2 }} xs={{ size: 12, offset: 0 }}>
					<Typography variant='subheading' gutterBottom>
						{this.props.children}
      		</Typography>
				</Col>
			</Row>
			</Container>
		);
	}
}
