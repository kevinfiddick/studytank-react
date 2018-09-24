import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {Container, Row, Col} from "reactstrap";
import {Link} from 'react-router-dom';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import './Link.css'

const smallFont = { fontSize: '12px' };

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#9E9E9E',
      main: '#9E9E9E',
      dark: '#9E9E9E',
			contrastText: '#fff',
    }
  },
});

export default class SecondaryTabs extends React.Component {
	state = {
		value: 5
	};

	componentWillMount() {
		var currentLocation = this.props.subpath;
		switch(currentLocation){
			case 'register':
				this.setState({ value: 0 });
				break;
			case 'login':
				this.setState({ value: 1 });
				break;
		}
	}

	render() {
		return (
		<MuiThemeProvider theme={theme}>
      <Container fluid={true}>
				<Row>
          <Col xs="12" style={{margin: '0px', padding: '0px'}}>
            <AppBar
							position="static"
							color="default"
						>
              <Tabs
                value={this.state.value}
                indicatorColor="primary"
                fullWidth
                centered
              >
								<Tab
		              label={<span style={smallFont}>Register</span>}
									component={Link}
									to='/register'
									className="darklink"
								/>
								<Tab
		              label={<span style={smallFont}>Login</span>}
									component={Link}
									to='/login'
									className="darklink"
								/>
					    </Tabs>
            </AppBar>
          </Col>
        </Row>
      </Container>
		</MuiThemeProvider>
		);
	}
}
