import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {Container, Row, Col} from "reactstrap";
import {Link} from 'react-router-dom';

import PersonIcon from "@material-ui/icons/Person";
import NotificationIcon from "@material-ui/icons/Notifications";
import AssessmentIcon from "@material-ui/icons/Subject";
import SearchIcon from "@material-ui/icons/Search";

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import './Link.css'

const smallFont = { fontSize: '12px' };

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#FFFFFF',
      main: '#0000c6',
      dark: '#000000',
			contrastText: '#fff',
    },
	   secondary: {
	     light: '#0763d3',
	     main: '#fff',
	     dark: '#0000c6',
	     contrastText: '#fff',
	   },
  },
});

/** TODO:
	(1)	change state.value to match current page
**/

export default class IconLabelTabs extends React.Component {
	state = {
		value: 5
	};

	componentWillMount() {
		var currentLocation = this.props.pathname;
		console.log(currentLocation)
		switch(currentLocation){
			case 'dashboard':
				this.setState({ value: 0 });
				break;
			case 'notifications':
				this.setState({ value: 1 });
				break;
			case 'assessments':
				this.setState({ value: 2 });
				break;
			case 'search':
				this.setState({ value: 3 });
				break;
		}
	}

	render() {
		return (
    <MuiThemeProvider theme={theme}>
        <Row>
          <Col xs="12">
            <AppBar
							position="static"
							color="primary"
						>
              <Tabs
                value={this.state.value}
                fullWidth
                indicatorColor="secondary"
                centered
              >
								<Tab
									icon={<PersonIcon />}
		              label={<span style={smallFont}>Profile</span>}
									component={Link}
									to='/dashboard/notes'
									className="lightlink"
								/>
								<Tab
									icon={<NotificationIcon />}
		              label={<span style={smallFont}>Notifications</span>}
									component={Link}
									to='/notifications'
									className="lightlink"
								/>
								<Tab
									icon={<AssessmentIcon />}
		              label={<span style={smallFont}>Assessments</span>}
									component={Link}
									to='/assessments'
									className="lightlink"
								/>
								<Tab
									icon={<SearchIcon />}
		              label={<span style={smallFont}>Search</span>}
									component={Link}
									to='/search'
									className="lightlink"
								/>
					    </Tabs>
		        </AppBar>
          </Col>
        </Row>
			</MuiThemeProvider>
		);
	}
}
