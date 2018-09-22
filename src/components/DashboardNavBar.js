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

	componentDidMount() {
		var currentLocation = this.props.subpath;
		console.log(currentLocation)
		switch(currentLocation){
			case 'notes':
				this.setState({ value: 0 });
				break;
			case 'groups':
				this.setState({ value: 1 });
				break;
			case 'settings':
				this.setState({ value: 2 });
				break;
			case 'exit':
				this.setState({ value: 3 });
				break;
		}
	}

	render() {
		return (
		<MuiThemeProvider theme={theme}>
      <Container fluid={true}>
				<Row>
          <Col xs="12">
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
		              label={<span style={smallFont}>Notes</span>}
									component={Link}
									to='/dashboard/notes'
									className="darklink"
								/>
								<Tab
		              label={<span style={smallFont}>Groups</span>}
									component={Link}
									to='/dashboard/groups'
									className="darklink"
								/>
								<Tab
		              label={<span style={smallFont}>Settings</span>}
									component={Link}
									to='/dashboard/settings'
									className="darklink"
								/>
								<Tab
		              label={<span style={smallFont}>Log Off</span>}
									component={Link}
									to='/dashboard/exit'
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
