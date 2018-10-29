import React from 'react';
import ax from './api';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import {Container, Row, Col} from "reactstrap";
import sortBy from 'lodash/sortBy';
import {Link} from 'react-router-dom';
import './FilterList.css'
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import AdminIcon from "@material-ui/icons/SupervisorAccount";
import StudentIcon from "@material-ui/icons/Assignment";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
	palette: {
	   secondary: {
	     light: '#616161',
	     main: '#616161',
	     dark: '#212121',
	     contrastText: '#fff',
	   }
  },
	overrides: {
      MuiButton: {
        root: {
          marginTop: 4,
        }
      }
    }
});

export default class FilterCourseList extends React.Component {
	state = {
				email: '',
				adminCourses: [],
				emrolledCourses: [],
		    items: [],
				filteredItems: [],
				viewItems: [],
				sortedItems: [],
				username: '',
				field: '',
				view: 'all',
				sort: 'date'
	};

	onViewChange(e){
		const view = e.target.value;
		var oldSort = this.state.sort;
		this.setState({ sort: 'date' });
		this.setState({ view: view });

		const originalList = this.state.items;
		var newList = [];

		switch (view){
			case 'admin':
					newList = this.state.adminCourses;
					break;
			case 'enrolled':
					newList = this.state.enrolledCourses;
					break;
			case 'all':
					newList = this.state.items;
					break;
		}

    this.setState({ viewItems: newList });

		this.sortChange(oldSort, newList);
	}

 /**
	*	ON SELECT SORT CHANGE
	*	This function is called when the "Sort By: " select box is changed
	* This function will call sortChange
	*
  */
	onSortChange(e){
		const sort = e.target.value;
		const viewList = this.state.viewItems;

		this.sortChange(sort, viewList);
	}

	sortChange = (sort, viewList) => {
			this.setState({ sort: sort });

			var sortedList = [];

			switch (sort){
				case 'date':
						sortedList = viewList;
						for(var i = 0; i < sortedList.length; i++){
							var course = sortedList[i];
							course.value.field = "";
							sortedList[i] = course;
						}
						this.setState({ field: '' });
						break;
				case 'abc':
						sortedList = sortBy(viewList, [function(course) { return course.value.title; }]);
						for(var i = 0; i < sortedList.length; i++){
							var course = sortedList[i];
							course.value.field = "";
							sortedList[i] = course;
						}
						this.setState({ field: '' });
						break;
				case 'course':
						sortedList = sortBy(viewList, [function(course) { return course.value.course; }]);
						for(var i = 0; i < sortedList.length; i++){
							var course = sortedList[i];
							course.value.field = course.value.course;
							sortedList[i] = course;
						}
						this.setState({ field: 'Course: '});
						break;
				case 'professor':
						sortedList = sortBy(viewList, [function(course) { return course.value.professor; }]);
						for(var i = 0; i < sortedList.length; i++){
							var course = sortedList[i];
							course.value.field = course.value.professor;
							sortedList[i] = course;
						}
						this.setState({ field: 'Professor: '});
						break;
				case 'school':
						sortedList = sortBy(viewList, [function(course) { return course.value.school; }]);
						for(var i = 0; i < sortedList.length; i++){
							var course = sortedList[i];
							course.value.field = course.value.school;
							sortedList[i] = course;
						}
						this.setState({ field: 'School: '});
						break;
			}

			this.setState({ sortedItems: sortedList });
			this.setState({ filteredItems: sortedList });
	}

	/**
	 *	ON FILTER INPUT CHANGE
	 *	This function is called when the "Filter" input box is changed
	 *  This function will change the filter list to display only what
	 *  matches user input.
	 *  This function is performed on the final layer of the list.
	 *  The first layer is determined by ON VIEW CHANGE and saved in
	 *  state.viewItems
	 *  The final layer (This one) is saved in state.filteredItems.
	 *
	 */
	onFilterInputChange(e){

		const sortedList = this.state.sortedItems;
    const updatedList = sortedList.filter(function(item){
      return (item.value.title.toLowerCase().search(
        e.target.value.toLowerCase()) !== -1) ||
				(item.value.field.toLowerCase().search(
	      e.target.value.toLowerCase()) !== -1);
    });
    this.setState({ filteredItems: updatedList });
  }

	componentDidMount() {
		const email = localStorage.getItem('email');
		this.setState({email: email});

		const setCourses = () => {
			ax.get('/' + 'course' + '/_design/members/_view/all?key=\"' + email + '\"')
				.then(res => {
						const viewArray = res.data.rows;
						const itemsArray = this.state.items;
						itemsArray.push.apply(itemsArray, viewArray);
						this.setState({ items: itemsArray });
						this.setState({ filteredItems: itemsArray });
						this.setState({ viewItems: itemsArray });
						var adminCourses = [];
						var enrolledCourses = [];
						for( var i = 0; i < viewArray.length; i++){
							var view = viewArray[i].value.label;
							switch(view) {
								case 'admin':
									adminCourses.push(viewArray[i]);
									break;
								case 'enrolled':
									enrolledCourses.push(viewArray[i]);
									break;
							}
						}
						this.setState({ adminCourses: adminCourses });
						this.setState({ enrolledCourses: enrolledCourses });

				});
			}
			setCourses();

	}

	/**
	 *	RENDER
	 *	This Renders the List from "class List" with options to
	 *  view and sort items, as well as a user input filter
	 */
	render() {
		return(
			<div>
			{this.state.items.length !== 0 &&
			<Container>
				<br/>
				<Row>
					<Col md={{ size: 4, offset: 2 }} xs={{ size: 6, offset: 0 }}>
						<FormControl
						fullWidth>
        			<InputLabel htmlFor="view">View:</InputLabel>
          		<Select
            			value={this.state.view}
            			onChange={this.onViewChange.bind(this)}
            			name="view"
            			displayEmpty
            			inputProps={{
              			name: 'view',
              			id: 'view',
            			}}
        			>
            		<MenuItem value="all">All</MenuItem>
            		<MenuItem value="admin">Admin Courses</MenuItem>
            		<MenuItem value="enrolled">Enrolled Courses</MenuItem>
          		</Select>
        		</FormControl>
					</Col>
					<Col md={{ size: 4, offset: 0 }} xs={{ size: 6, offset: 0 }}>
						<FormControl
						fullWidth>
        			<InputLabel htmlFor="sort">Sort By:</InputLabel>
          		<Select
            			value={this.state.sort}
            			onChange={this.onSortChange.bind(this)}
            			name="sort"
            			displayEmpty
            			inputProps={{
              			name: 'sort',
              			id: 'sort',
            			}}
        			>
            		<MenuItem value="date">Date Added</MenuItem>
	            	<MenuItem value="abc">Alphabetical</MenuItem>
            		<MenuItem value="course">Course #</MenuItem>
            		<MenuItem value="professor">Professor</MenuItem>
            		<MenuItem value="school">School</MenuItem>
          		</Select>
        		</FormControl>
					</Col>
				</Row>
				<Row>
					<Col md={{ size: 8, offset: 2 }} xs={{ size: 12, offset: 0 }}>
						<TextField
          		id="filterInput"
          		label="Filter"
		          type="search"
							margin="normal"
							className="filter"
							onChange={this.onFilterInputChange.bind(this)}
							fullWidth
							autoComplete='off'
        		/>
					<MuiThemeProvider theme={theme}>
							<ul>
								{this.state.filteredItems.map(item =>
									<div key={item.id}>
										<Row>
											<Col xs={{ size: 12 }}>
									<Button
										variant="contained"
										color="secondary"
										fullWidth
										classes={{
											root: 'light',
        							label: 'lightLabel'
      							}}
                    component={Link} to={`/course/${item.id}`}
									>
									<span className='lightLabel' >
										{item.value.label === 'admin' && <AdminIcon />}
										{item.value.label === 'enrolled' && <StudentIcon />}
										<span>
											{item.value.title} <br/>
											{this.state.field} {item.value.field}
										</span></span>
									</Button>
								</Col>
									</Row>
									<Row></Row>
									</div>
								)}
							</ul>
							</MuiThemeProvider>
					</Col>
				</Row>
			</Container>
		}

		{this.state.items.length === 0 &&
		<Container>
			<br/>
			<Row>
				<Col md={{ size: 8, offset: 2 }} xs={{ size: 12, offset: 0 }}>
			<Typography variant="subheading" gutterBottom>
				You are not enrolled in any courses.
			</Typography>
				</Col>
			</Row>
		</Container>}

	</div>);
	}
}
