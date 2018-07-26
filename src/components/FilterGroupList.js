import React from 'react';
import ax from './api';
import Button from '@material-ui/core/Button';
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

import MyGroupIcon from "@material-ui/icons/Group";
import FollowedGroupIcon from "@material-ui/icons/GroupAdd";

export default class FilterList extends React.Component {

	state = {
				myGroups: [],
				followedGroups: [],
		    items: [],
				filteredItems: [],
				viewItems: [],
				sortedItems: [],
				username: '',
				field: '',
				view: 'all',
				sort: 'date'
	};

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
      return item.value.title.toLowerCase().search(
        e.target.value.toLowerCase()) !== -1;
    });
    this.setState({ filteredItems: updatedList });
  }

 /**
	*	ON SELECT VIEW CHANGE
	*	This function is called when the "View: " select box is changed
	* This function will change the filter list to display one of three options:
	* - All
	* - MY GROUPS
	* - FOLLOWED GROUPS
	*
  */
	onViewChange(e){
		const view = e.target.value;
		this.setState({ view: view });
		console.log(view);

		const originalList = this.state.items;
		var newList = [];

		switch (view){
			case 'mygroups':
					newList = this.state.myGroups;
					break;
			case 'followed':
					newList = this.state.followedGroups;
					break;
			case 'all':
					newList = this.state.items;
					break;
		}
		console.log(this.state.followedGroups);

    this.setState({ viewItems: newList });
    this.setState({ filteredItems: newList });

	}

 /**
	*	ON SELECT SORT CHANGE
	*	This function is called when the "Sort By: " select box is changed
	* This function will change the order of the filter list to one of the
	* four options:
	* - DATE ADDED
	* - ALPHABETICAL
	* - SUBJECT
	* - SCHOOL
	*
  */
	onSortChange(e){
		const sort = e.target.value;
		this.setState({ sort: sort });
		console.log(sort);

		const viewList = this.state.viewItems;
		var sortedList = [];

		switch (sort){
			case 'date':
					sortedList = viewList;
					this.setState({ field: '' });
					break;
			case 'abc':
					sortedList = sortBy(viewList, [function(group) { return group.value.title; }]);
					this.setState({ field: '' });
					break;
			case 'subject':
					sortedList = viewList
					this.setState({ field: 'Subject: '});
					break;
			case 'school':
					sortedList = viewList;
					this.setState({ field: 'School: '});
					break;
		}
		console.log(sortedList);

		this.setState({ sortedItems: sortedList });
    this.setState({ filteredItems: sortedList });
	}

 /**
	*	COMP WILL MOUNT
	*	This function is called when the Compounent is ready to mount
	* This function will populate the filter list to have the ability to display one of three options:
	* - All
	* - MY GROUPS
	* - FOLLOWED GROUPS
	*/
	componentWillMount() {
		//TODO: catch param username (email address of user)

		const setGroups = (view) => {
			ax.get('/' + 'group' + '/_design/dashboard/_view/' + view + '?key=\"' + 'user56@example.com' + '\"')
				.then(res => {
						const viewArray = res.data.rows;
						const itemsArray = this.state.items;
						itemsArray.push.apply(itemsArray, viewArray);
						this.setState({ items: itemsArray });
						this.setState({ filteredItems: itemsArray });
						this.setState({ viewItems: itemsArray });
						switch(view) {
							case 'mygroups':
								this.setState({ myGroups: viewArray });
							case 'followed':
								this.setState({ followedGroups: viewArray });
						}

				});
			}
				setGroups('mygroups');
				setGroups('followed');
				console.log(this.state.followedGroups);

	}

	/**
	 *	RENDER
	 *	This Renders the List from "class List" with options to
	 *  view and sort items, as well as a user input filter
	 */
	render() {
		return(
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
            		<MenuItem value="mygroups">My Groups</MenuItem>
            		<MenuItem value="followed">Followed Groups</MenuItem>
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
            		<MenuItem value="subject">Subject</MenuItem>
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
        		/>

							<ul>
								{this.state.filteredItems.map(item =>
									<Button
										key={item.id}
										variant="outlined"
										color="primary"
										className="button"
										fullWidth
									>
										{<MyGroupIcon />}
										{item.value.title} <br/>
										{this.state.field}
									</Button>
								)}
							</ul>
					</Col>
				</Row>
			</Container>
    );
	}
}
