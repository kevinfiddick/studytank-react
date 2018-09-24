import React from 'react';
import {Container, Row, Col} from "reactstrap";
import {Link} from 'react-router-dom';

const container = {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%'
};

export default class Logo extends React.Component {
	render() {
		return (
			<Container fluid={true}>
			<Row>
				<Col xs="12">
					<br/>
					<Link to={`/search`}>
				<div
					style={ container }
				>
					<img
						style={{
							minWidth: "320px",
							maxHeight: "100px",
    					display: "block",
    					marginLeft: "auto",
    					marginRight: "auto"
						}}
						src={require('../fullLogo.svg')}
						alt='StudyTank'
					/>
				</div>
				</Link>
					<br/>
				</Col>
			</Row>
			</Container>
		);
	}
}
