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

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import UploadedNoteIcon from "@material-ui/icons/InsertDriveFile";
import BookmarkedNoteIcon from "@material-ui/icons/BookmarkBorder";

/** TODO:
	(1)	Get Username from localStorage!
	(2) Sort by Date Uploaded!
	(3) Sort by Rating!
	(4) Add select boxes
	(5) Add delete button to delete selected Notes
	(6) Add folder button to add selected Notes to a folder
	(7) Add group button to add selected Notes to a group
	(8) Add cut and paste (cut to session storage paste from session storage)
**/

export default class FilterNoteList extends React.Component {
	state = {
				uploadedNotes: [],
				bookmarkedNotes: [],
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
      return (item.value.title.toLowerCase().search(
        e.target.value.toLowerCase()) !== -1) ||
				(item.value.field.toLowerCase().search(
	      e.target.value.toLowerCase()) !== -1);
    });
    this.setState({ filteredItems: updatedList });
  }

	/**
 	 *	ON SELECT SORT CHANGE
 	 *	This function is called when the "Sort By: " select box is changed
 	 * This function will change the order of the filter list to one of the
 	 * four options:
 	 * - Date Uploaded
 	 * - ALPHABETICAL
	 * - RATING
	 * - AUTHOR
 	 * - SUBJECT
 	 * - SCHOOL
   */
	sortChange = (sort, viewList) => {
			this.setState({ sort: sort });

			var sortedList = [];

			switch (sort){
				case 'date':
						sortedList = viewList;
						for(var i = 0; i < sortedList.length; i++){
							var note = sortedList[i];
							note.value.field = "";
							sortedList[i] = note;
						}
						this.setState({ field: '' });
						break;
				case 'abc':
						sortedList = sortBy(viewList, [function(note) { return note.value.title; }]);
						for(var i = 0; i < sortedList.length; i++){
							var note = sortedList[i];
							note.value.field = "";
							sortedList[i] = note;
						}
						this.setState({ field: '' });
						break;
				case 'rating':
						//TODO: Sort by rating!
						break;
				case 'author':
						sortedList = sortBy(viewList, [function(note) { return note.value.author; }]);
						for(var i = 0; i < sortedList.length; i++){
							var note = sortedList[i];
							note.value.field = note.value.authorLastname + ", " + note.value.authorFirstname;
							sortedList[i] = note;
						}
						this.setState({ field: 'Author: '});
						break;
				case 'subject':
						sortedList = sortBy(viewList, [function(note) { return note.value.subject; }]);
						for(var i = 0; i < sortedList.length; i++){
							var note = sortedList[i];
							note.value.field = note.value.subject;
							sortedList[i] = note;
						}
						this.setState({ field: 'Subject: '});
						break;
				case 'school':
						sortedList = sortBy(viewList, [function(note) { return note.value.school; }]);
						for(var i = 0; i < sortedList.length; i++){
							var note = sortedList[i];
							note.value.field = note.value.school;
							sortedList[i] = note;
						}
						this.setState({ field: 'School: '});
						break;
			}

			this.setState({ sortedItems: sortedList });
			this.setState({ filteredItems: sortedList });
	}

 /**
	*	ON SELECT VIEW CHANGE
	*	This function is called when the "View: " select box is changed
	* This function will change the filter list to display one of three options:
	* - All
	* - UPLOADED NOTES
	* - BOOKMARKED NOTES
	*
  */
	onViewChange(e){
		const view = e.target.value;
		var oldSort = this.state.sort;
		this.setState({ sort: 'date' });
		this.setState({ view: view });

		const originalList = this.state.items;
		var newList = [];

		switch (view){
			case 'mynotes':
					newList = this.state.uploadedNotes;
					break;
			case 'bookmarked':
					newList = this.state.bookmarkedNotes;
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

 /**
	*	COMP WILL MOUNT
	*	This function is called when the Compounent is ready to mount
	* This function will populate the filter list to have the ability to display one of three options:
	* - All
	* - UPLOADED NOTES
	* - BOOKMARKED NOTES
	*/
	componentWillMount() {
		//TODO: catch param username (email address of user)
		const setNotes = (view) => {
			const email = localStorage.getItem('email');
			ax.get('/' + 'note' + '/_design/dashboard/_view/' + view + '?key=\"' + email + '\"')
				.then(res => {
						const viewArray = res.data.rows;
						const itemsArray = this.state.items;
						itemsArray.push.apply(itemsArray, viewArray);
						this.setState({ items: itemsArray });
						this.setState({ filteredItems: itemsArray });
						this.setState({ viewItems: itemsArray });
						switch(view) {
							case 'mynotes':
								this.setState({ uploadedNotes: viewArray });
								break;
							case 'bookmarked':
								this.setState({ bookmarkedNotes: viewArray });
								break;
						}

				});
			}
				setNotes('mynotes');
				setNotes('bookmarked');

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
            		<MenuItem value="mynotes">Uploaded Notes</MenuItem>
            		<MenuItem value="bookmarked">Bookmarked Notes</MenuItem>
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
            		<MenuItem value="date">Date Uploaded</MenuItem>
	            	<MenuItem value="abc">Alphabetical</MenuItem>
	            	<MenuItem value="rating">Rating</MenuItem>
            		<MenuItem value="author">Author</MenuItem>
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
							autoComplete='off'
        		/>
							<ul>
								{this.state.filteredItems.map(item =>
									<Row key={item.id}>
									<Col xs={{ size: 1 }}>
										<FormControlLabel
          						control={
            						<Checkbox
              						value="checkedB"
              						color="primary"
            						/>
          						}
        						/>
									</Col>
									<Col xs={{ size: 11 }}>
									<Button
										variant="outlined"
										color="primary"
										fullWidth
										classes={{
											root: 'button',
        							label: 'buttonLabel'
      							}}

									>
									<span className='buttonLabel' >
										{item.value.label === 'mynotes' && <UploadedNoteIcon />}
										{item.value.label === 'bookmarked' && <BookmarkedNoteIcon />}
										<span>
											{item.value.title} <br/>
											{this.state.field} {item.value.field}
										</span></span>
									</Button>
								</Col>
							</Row>
								)}
							</ul>
					</Col>
				</Row>
			</Container>
    );
	}
}
