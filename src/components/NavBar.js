import React from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {Container, Row, Col} from "reactstrap";
import {Link} from 'react-router-dom';

import PersonIcon from "@material-ui/icons/Person";
import NotificationIcon from "@material-ui/icons/Notifications";
import AssessmentIcon from "@material-ui/icons/Subject";
import SearchIcon from "@material-ui/icons/Search";

const smallFont = { fontSize: '12px' };

export default class IconLabelTabs extends React.Component {
	state = {
		value: 5
	};
	handleChange = (event, value) => {
		this.setState({
			value
		});
	};

	render() {
		return (
        <Row>
          <Col xs="12">
            <Paper>
              <Tabs
                value={this.state.value}
                style={{fontSize: "10px"}}
                fullWidth
                indicatorColor="primary"
                textColor="primary"
                centered
              >
								<Tab
									icon={<PersonIcon />}
		              label={<span style={smallFont}>Profile</span>}
									component={Link}
									to='/dashboard'
								/>
								<Tab
									icon={<NotificationIcon />}
		              label={<span style={smallFont}>Notifications</span>}
									component={Link}
									to='/notifications'
								/>
								<Tab
									icon={<AssessmentIcon />}
		              label={<span style={smallFont}>Assessments</span>}
									component={Link}
									to='/assessments'
								/>
								<Tab
									icon={<SearchIcon />}
		              label={<span style={smallFont}>Search</span>}
									component={Link}
									to='/search'
								/>
					    </Tabs>
            </Paper>
          </Col>
        </Row>
		);
	}
}
