import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {Container, Row, Col} from "reactstrap";
import {Link} from 'react-router-dom';
import Badge from '@material-ui/core/Badge';
import ax from './api';

import PersonIcon from "@material-ui/icons/Person";
import NotificationIcon from "@material-ui/icons/Notifications";
import AssessmentIcon from "@material-ui/icons/Subject";
import SearchIcon from "@material-ui/icons/Search";

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import './Link.css'

const smallFont = { fontSize: '12px' };
const smallFontShifted = { fontSize: '12px', position: 'relative', right: '-10px' };

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
	   }
  }
});

const badge = createMuiTheme({
  palette: {
    primary: {
      light: '#FFFFFF',
      main: '#0000c6',
      dark: '#000000',
			contrastText: '#fff',
    },
	   secondary: {
	     light: '#F44336',
	     main: '#F44336',
	     dark: '#D50000',
	     contrastText: '#fff',
	   }
  }
});

/** TODO:
	(1)	change state.value to match current page
**/

export default class IconLabelTabs extends React.Component {
	state = {
		value: 5,
    unread: 0
	};

	componentDidMount() {
		var currentLocation = this.props.pathname;
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

    const email = localStorage.getItem('email');

    if(email != null){
      ax.get('/' + 'user' + '/' + email)
        .then(res => {
          var user = res.data;
          var unread = 0;
          for(var i = 0; i< user.notifications.length; i++){
            var notification = user.notifications[i];
            if(!notification.hasOwnProperty('seen')){
              notification.status == 'seen' ? notification.seen = true :  notification.seen = false;
              delete notification.status;
            }
            if(notification.seen == false){
              unread++;
            }
          }
          this.setState({unread: unread});
        });
      }

	}

	render() {
		return (
    <MuiThemeProvider theme={theme}>
      <Container fluid='true'>
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
									icon={
                    <MuiThemeProvider theme={badge}>
                      {this.state.unread > 0 &&
                        <Badge badgeContent={this.state.unread} color="secondary" className="badge"><NotificationIcon /></Badge>
                      }
                      {this.state.unread === 0 &&
                        <NotificationIcon />
                      }
                    </MuiThemeProvider>
                  }
		              label={
                    <span>
                      {this.state.unread > 0 && <span style={smallFontShifted}>Notifications</span>}
                      {this.state.unread === 0 && <span style={smallFont}>Notifications</span>}
                    </span>
                  }
									component={Link}
									to='/notifications'
									className="lightlink"
								/>
              {/*
								<Tab
									icon={<AssessmentIcon />}
		              label={<span style={smallFont}>Assessments</span>}
									component={Link}
									to='/assessments'
									className="lightlink"
								/>
              **/}
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
      </Container>
		</MuiThemeProvider>
		);
	}
}
