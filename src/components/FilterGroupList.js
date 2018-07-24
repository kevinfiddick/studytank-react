import React from 'react';
import ax from './api';
import Button from '@material-ui/core/Button';
import {Container, Row, Col} from "reactstrap";
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
				unfilteredItems: [],
				username: '',
				field: '',
				siew: ''
	};

	/**
	 *	ON FILTER INPUT CHANGE
	 *	This function is called when the "Filter" input box is changed
	 *  This function will change the filter list to display only what
	 *  matches user input.
	 *  This function is performed on the second, and final layer of
	 *  filtering.
	 *  The first layer is determined by ON VIEW CHANGE and saved in
	 *  state.unfilteredItems.
	 *  The second layer (This one) is saved in state.filteredItems.
	 *
	**/
	onFilterInputChange(e){

		var viewList = this.state.unfilteredItems;
    var updatedList = viewList.filter(function(item){
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
 **/
	onViewChange(e){
		const view = e.target.value;

		var originalList = this.state.items;

		const view = e.target.value;
		switch (view){
			case 'mygroups':
					viewList = this.state.myGroups;
			case 'followed':
					viewList = this.state.followedGroups;
			case 'All':
					viewList = this.state.items;
		}
    this.setState({ unfilteredItems: updatedList });
    this.setState({ filteredItems: updatedList });
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
		setGroups(){
			ax.get('/' + 'group' + '/_design/dashboard/_view/' + props.view + '?key=\"' + 'user56@example.com' + '\"')
				.then(res => {
						const addView = res.data.rows;
						const itemsArray = this.state.items;
						itemsArray.push.apply(itemsArray, addView);
    				console.log(itemsArray);
        		this.setState({ items: itemsArray });
        		this.setState({ filteredItems: itemsArray });
        		this.setState({ unfilteredItems: itemsArray });
						switch(props.view) {
    					case 'mygroups':
      					this.setState({ myGroups: itemsArray });
		    			case 'followed':
		      			this.setState({ followedGroups: itemsArray });
  					}
    				console.log(this.state.items);

				});
			}

			setGroups('mygroups');
			setGroups('followed');

	}

	render() {
		return(
			<Container>
				<Row>
					<Col md={{ size: 6, offset: 0 }} xs={{ size: 6, offset: 0 }}>

					</Col>
					<Col md={{ size: 6, offset: 0 }} xs={{ size: 6, offset: 0 }}>
						<FormControl>
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
          		<FormHelperText>View: My Groups, Followed Groups, or Both</FormHelperText>
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
      			<List items={this.state.filteredItems} field={this.state.field}/>
					</Col>
				</Row>
			</Container>
    );
	}
}

/**
 *	CLASS LIST
 *	This Class is called when FilterList is rendered.
 *  This Class will render the physical list from props.items (filteredItems)
 */
class List extends React.Component {
	render() {
		return(
			<ul>
				{this.props.items.map(item =>
					<Button
						key={item.id}
						variant="outlined"
						color="primary"
						className="button"
						fullWidth
					>
						{<MyGroupIcon />}
						{item.value.title}
						{this.props.field == '' ? this.props.field : null}
					</Button>
				)}
			</ul>
		)
	}
}
