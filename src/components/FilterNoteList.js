import React from 'react';
import ax from './api';
import ConfirmationModal from './ConfirmationModal';
import MUIButton from '@material-ui/core/Button';
import {Container, Row, Col} from "reactstrap";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import orderBy from 'lodash/orderBy';
import pullAllBy from 'lodash/pullAllBy';
import {Link} from 'react-router-dom';
import './FilterList.css';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import DeleteIcon from "@material-ui/icons/DeleteForever";
import NewFolderIcon from "@material-ui/icons/CreateNewFolder";
import AddToGroupIcon from "@material-ui/icons/GroupAdd";
import MoveIcon from "@material-ui/icons/FormatListBulleted";

import UploadedNoteIcon from "@material-ui/icons/InsertDriveFile";
import BookmarkedNoteIcon from "@material-ui/icons/BookmarkBorder";
import FolderIcon from "@material-ui/icons/Folder";
import OpenFolderIcon from "@material-ui/icons/FolderOpen";
import StarIcon from "@material-ui/icons/Star";
import HalfStarIcon from "@material-ui/icons/StarBorder";
import StarOutlineIcon from "@material-ui/icons/StarHalf";

import MyGroupIcon from "@material-ui/icons/Group";

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
	   secondary: {
	     light: '#00796B',
	     main: '#FF6F00',
	     dark: '#E65100',
	     contrastText: '#fff',
	   }
  }
});

const smallFont = { fontSize: '12px' };

export default class FilterNoteList extends React.Component {
	state = {
				uploadedNotes: [],
				bookmarkedNotes: [],
		    items: [],
				filteredItems: [],
				viewItems: [],
				sortedItems: [],
				folders: [],
				email: '',
				field: '',
				view: 'all',
				sort: 'abc',
				selectedItems: [],
				selectedFolders: [],
				deleteStatus: 'Delete',
				folderStatus: 'Create Folder',
				moveStatus: 'Move',
				shareStatus: 'Share',
				folderName: '',
				moveFolderSelect: '',
				openFolder: '',
				myGroups: [],
				shareGroupSelect: '',
				newFolder: 'New Folder',
				keepFolders: true
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
				case 'abc':
						sortedList = orderBy(viewList, [note => note.value.title.toLowerCase()]);
						for(var i = 0; i < sortedList.length; i++){
							var note = sortedList[i];
							note.value.field = "";
							sortedList[i] = note;
						}
						this.setState({ field: '' });
						break;
				case 'rating':
						//calculate overall rating or find personal rating
						for(var i = 0; i < viewList.length; i++){
							var note = viewList[i];
							if(note.value.rating.hasOwnProperty(this.state.email)){
									note.value.personalRating = note.value.rating[this.state.email];
							}
							else{
								var sum = 0;
								var total = 0;
								for (var key in note.value.rating) {
    							if (note.value.rating.hasOwnProperty(key)) {
											var rating = note.value.rating[key];
											sum += rating;
											total += 1;
    							}
								}
								total > 0 ?
								note.value.personalRating = sum/total:
								note.value.personalRating = 0;
							}
							viewList[i] = note;
						}
						//Sort by rating!
						sortedList = orderBy(viewList, [note => note.value.personalRating], ['desc']);
						for(var i = 0; i < sortedList.length; i++){
							var note = sortedList[i];
							var stars = '';
							var r = Math.round(note.value.personalRating);
							for(var m = 0; m < 5 ;m++){
								if (r > m){
									stars +="★";
								}
								else{
									stars +="☆";
								}
							}

							note.value.field = stars;
							sortedList[i] = note;
						}
						this.setState({ field: 'Rating: ' });
						break;
				case 'author':
						sortedList = orderBy(viewList, [note => note.value.authorLastname.toLowerCase()]);
						for(var i = 0; i < sortedList.length; i++){
							var note = sortedList[i];
							note.value.field = note.value.authorLastname + ", " + note.value.authorFirstname;
							sortedList[i] = note;
						}
						this.setState({ field: 'Author: '});
						break;
				case 'subject':
						sortedList = orderBy(viewList, [note => note.value.subject.toLowerCase()]);
						for(var i = 0; i < sortedList.length; i++){
							var note = sortedList[i];
							note.value.field = note.value.subject;
							sortedList[i] = note;
						}
						this.setState({ field: 'Subject: '});
						break;
				case 'school':
						sortedList = orderBy(viewList, [note => note.value.school.toLowerCase()]);
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
		this.setState({ sort: 'abc' });
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
	 *	ON ITEM SELECTION
	 *	This function is called when an item's checkbox is changed
	 *
	 */

	 onSelectedItem(e){
     var selectedItems = this.state.selectedItems;
		 var selectedFolders = this.state.selectedFolders;
		 var items = this.state.items;

		 if(e.target.checked === true){
			 selectedItems.push(e.target.id);
		 }
		 else{
			 var copy = [];
			 for(var i = 0; i < selectedItems.length; i++){
				 selectedItems[i] != e.target.id &&
					 copy.push(selectedItems[i]);
			 }
			 selectedItems = copy;
		 }

     var addFolder = [];
     var nullFolder = [];
		 for(var i = 0; i < items.length; i++){
			 var item = items[i];
			 var folderID = item.value.folder[this.state.email];
			 if(selectedFolders.includes(folderID) && !selectedItems.includes(item.id)){
				 var foldersCopy = [];
	 			 for(var i = 0; i < selectedFolders.length; i++){
	 				 selectedFolders[i] != folderID ?
	 					 foldersCopy.push(selectedFolders[i]):
             nullFolder.push(folderID);
	 			 }
				 selectedFolders = foldersCopy;
			 }
       else{
         if(!selectedFolders.includes(folderID) && selectedItems.includes(item.id)){
           if(!addFolder.includes(folderID) && folderID != this.state.email){
             addFolder.push(folderID);
           }
         }
         if(!selectedFolders.includes(folderID) && !selectedItems.includes(item.id)){
           if(!nullFolder.includes(folderID) && folderID != this.state.email){
             nullFolder.push(folderID);
           }
			   }
       }
		 }
		 for(var i = 0; i < addFolder.length; i++){
       if(!nullFolder.includes(addFolder[i])){
          selectedFolders.push(addFolder[i]);
       }
     }

		 this.setState({newFolder: "New Folder"});
		 this.setState({selectedItems: selectedItems});
		 this.setState({selectedFolders: selectedFolders});
	 }

	 	/**
	 	 *	ON Folder SELECTION
	 	 *	This function is called when a folder's checkbox is changed
		 *  This function selects the folder and toggles all of the contents
	 	 *
	 	 */
	 	 onSelectedFolder(e){

	 		 var items = this.state.items;
	 		 var selectedItems = this.state.selectedItems;
		 	 var selectedFolders = this.state.selectedFolders;
			 var folderID = e.target.id;

			 this.setState({newFolder: "New Folder"});
       this.setState({folderStatus: "Create Folder"});
	 		 if(e.target.checked){
				 if(selectedItems.length == 0 && selectedFolders.length == 0){
					 this.setState({newFolder: "Rename Folder"});
           this.setState({folderStatus: "Rename Folder"});
				 }
	 			 selectedFolders.push(folderID);
				 for(i = 0; i < items.length; i++){
					 var item = items[i];
					 if(item.value.folder[this.state.email] == folderID){
						 selectedItems.push(item.id);
					 }
				 }
	 		 }
	 		 else{
	 			 var foldersCopy = [];
				 var removeItems = [];

	 			 for(var i = 0; i < selectedFolders.length; i++){
	 				 selectedFolders[i] != folderID &&
	 					 foldersCopy.push(selectedFolders[i]);
	 			 }
				 for(i = 0; i < items.length; i++){
					 var item = items[i];
					 if(item.value.folder[this.state.email] == folderID){
						 removeItems.push(item.id);
					 }
				 }
				 selectedItems = selectedItems.filter(r => !removeItems.includes(r));

				 selectedFolders = foldersCopy;
	 		 }

			 this.setState({selectedFolders: selectedFolders});
	 		 this.setState({selectedItems: selectedItems});
	 	 }

	 onDeleteItems(e){
		 this.setState({deleteStatus: <span>Deleting... <CircularProgress /></span>});
		 var deleteIDs = this.state.selectedItems;
		 var i = 0;
		 var recursiveDelete = () => {
			if(i < deleteIDs.length) {
			 var deleteID = deleteIDs[i];
			 ax.get('/' + 'note' + '/' + deleteID).then(result => {
				 if(result.data.author == this.state.email){
			 		ax.delete('/' + 'note' + '/' + deleteID + '?rev=' + result.data._rev )
			 			.then(res => {
							i++;
							recursiveDelete();
			 			})
						.catch(err => {
						})
					}else{
						var note = result.data;
						var index = note.saved.indexOf(this.state.email);
						note.saved.splice(index, 1);
						note.folder == undefined ? note.folder = {} : delete note.folder[this.state.email];
						//Converts note ratings to JSON
						if(Object.prototype.toString.call(note.rating) === "[object Array]"){
							var newrating = {};
							for(var j = 0; j < note.rating.length; j++){
								newrating[note.rating[j].uniqueID] = note.rating[j].rating;
							}
							note.rating = newrating;
						}

						if(note.exclusive == undefined) note.exclusive = false;
						if(note.courses == undefined) note.courses = {};
						ax({
							method: 'post',
							url: '/note',
							data: {
								_id: note._id,
								_rev: note._rev,
								title: note.title,
  							content: note.content,
								author: note.author,
  							authorFirstname: note.authorFirstname,
  							authorLastname: note.authorFirstname,
  							subject: note.subject,
  							school: note.school,
  							date: note.date,
  							isFact: note.isFact,
  							language: note.language,
  							textbook: note.textbook,
  							saved: note.saved,
  							folder: note.folder,
  							comments: note.comments,
								rating: note.rating,
								exclusive: note.exclusive,
								courses: note.courses,
  							_attachments: note._attachments
							}
						}).then(res => {
							i++;
							recursiveDelete();
						});
					}
			 });
		  }else{
     		 window.location.reload();
		  }
		 }
		 recursiveDelete();
	 }

	 onShareWithGroup(e){
		 if(this.state.shareGroupSelect != ''){
	 		 this.setState({shareStatus: <span>Sharing... <CircularProgress /></span>});
			 var group = this.state.shareGroupSelect;
	 		 var itemIDs = this.state.selectedItems;
			 var keepFolders = this.state.keepFolders;
	 		 var i = 0;
	 		 var recursiveAddToGroup = () => {
	 			if(i < itemIDs.length) {
	 			 var itemID = itemIDs[i];
	 			 ax.get('/' + 'note' + '/' + itemID).then(result => {
					 var note = result.data;
					 if(note.folder == undefined) note.folder = {};
					 var folderName = note.folder[this.state.email];
					 keepFolders ? note.folder[group] = folderName : note.folder[group] = group;
					 if(!note.saved.includes(group)){
						 note.saved.push(group);
					 }
					 //Converts note ratings to JSON
					 if(Object.prototype.toString.call(note.rating) === "[object Array]"){
						 var newrating = {};
						 for(var j = 0; j < note.rating.length; j++){
							 newrating[note.rating[j].uniqueID] = note.rating[j].rating;
						 }
						 note.rating = newrating;
					 }

           if(note.exclusive == undefined) note.exclusive = false;
           if(note.courses == undefined) note.courses = {};
						 ax({
 							method: 'post',
 							url: '/note',
 							data: {
 								_id: note._id,
 								_rev: note._rev,
								title: note.title,
  							content: note.content,
  							author: note.author,
  							authorFirstname: note.authorFirstname,
  							authorLastname: note.authorLastname,
  							subject: note.subject,
  							school: note.school,
  							date: note.date,
  							isFact: note.isFact,
  							language: note.language,
  							textbook: note.textbook,
  							saved: note.saved,
  							folder: note.folder,
  							comments: note.comments,
  							rating: note.rating,
								exclusive: note.exclusive,
								courses: note.courses,
  							_attachments:note._attachments
 							}
 						}).then(res => {
							i++;
							recursiveAddToGroup();
						});

	 			 });
	 		  }
	 		 }
	 		 recursiveAddToGroup();
		 }
	 }

	 onMoveToFolder(e){
		 if(this.state.moveFolderSelect != ''){
	 		 this.setState({moveStatus: <span>Moving... <CircularProgress /></span>});
			 var folderName = this.state.moveFolderSelect;
	 		 var itemIDs = this.state.selectedItems;
	 		 var i = 0;
	 		 var recursiveAddToFolder = () => {
	 			if(i < itemIDs.length) {
	 			 var itemID = itemIDs[i];
	 			 ax.get('/' + 'note' + '/' + itemID).then(result => {
					 var note = result.data;
					 if(note.folder == undefined) note.folder = {};
					 note.folder[this.state.email] = folderName;
					 //Converts note ratings to JSON
					 if(Object.prototype.toString.call(note.rating) === "[object Array]"){
						 var newrating = {};
						 for(var j = 0; j < note.rating.length; j++){
							 newrating[note.rating[j].uniqueID] = note.rating[j].rating;
						 }
						 note.rating = newrating;
					 }

           if(note.exclusive == undefined) note.exclusive = false;
           if(note.courses == undefined) note.courses = {};
						 ax({
 							method: 'post',
 							url: '/note',
 							data: {
 								_id: note._id,
 								_rev: note._rev,
								title: note.title,
  							content: note.content,
  							author: note.author,
  							authorFirstname: note.authorFirstname,
  							authorLastname: note.authorLastname,
  							subject: note.subject,
  							school: note.school,
  							date: note.date,
  							isFact: note.isFact,
  							language: note.language,
  							textbook: note.textbook,
  							saved: note.saved,
  							folder: note.folder,
  							comments: note.comments,
  							rating: note.rating,
								exclusive: note.exclusive,
								courses: note.courses,
  							_attachments:note._attachments
 							}
 						}).then(res => {
							i++;
							recursiveAddToFolder();
						});

	 			 });
	 		  }else{
	 			 	window.location.reload();
	 		  }
	 		 }
	 		 recursiveAddToFolder();
		 }
	 }

	 onNewFolder(e){
	 		 this.setState({folderStatus: <span>Creating... <CircularProgress /></span>});
			 var folderName = this.state.folderName;
	 		 var itemIDs = this.state.selectedItems;
	 		 var i = 0;
	 		 var recursiveAddToFolder = () => {
	 			if(i < itemIDs.length) {
	 			 var itemID = itemIDs[i];
	 			 ax.get('/' + 'note' + '/' + itemID).then(result => {
					 var note = result.data;
					 if(note.folder == undefined) note.folder = {};
					 note.folder[this.state.email] = folderName;
					 //Converts note ratings to JSON
					 if(Object.prototype.toString.call(note.rating) === "[object Array]"){
						 var newrating = {};
						 for(var j = 0; j < note.rating.length; j++){
							 newrating[note.rating[j].uniqueID] = note.rating[j].rating;
						 }
						 note.rating = newrating;
					 }

           if(note.exclusive == undefined) note.exclusive = false;
           if(note.courses == undefined) note.courses = {};
						 ax({
 							method: 'post',
 							url: '/note',
 							data: {
 								_id: note._id,
 								_rev: note._rev,
								title: note.title,
  							content: note.content,
  							author: note.author,
  							authorFirstname: note.authorFirstname,
  							authorLastname: note.authorLastname,
  							subject: note.subject,
  							school: note.school,
  							date: note.date,
  							isFact: note.isFact,
  							language: note.language,
  							textbook: note.textbook,
  							saved: note.saved,
  							folder: note.folder,
  							comments: note.comments,
  							rating: note.rating,
								exclusive: note.exclusive,
								courses: note.courses,
  							_attachments:note._attachments
 							}
 						}).then(res => {
							i++;
							recursiveAddToFolder();
						});

	 			 });
	 		  }else{
	 			 	window.location.reload();
	 		  }
	 		 }
	 		 recursiveAddToFolder();
	 }


	 	/**
	 	 *	ON FOLDER NAME CHANGE
	 	 *	This function sets the folderName state to user input
	 	 *  This function also can set the folderName state to user selection
	 	 */
	 	onFolderNameChange(e){
	  		this.setState({ folderName: e.target.value.toLowerCase()});
	  }

	 	onMoveFolderSelected(e){
	  		this.setState({ moveFolderSelect: e.target.id.toLowerCase()});
	  }

		onShareGroupSelected(e){
			this.setState({ shareGroupSelect: e.target.id.toLowerCase()});
		}

			keepFoldersChange(e){
					this.setState({ keepFolders: e.target.checked});
			}
 /**
	*	COMP WILL MOUNT
	*	This function is called when the Compounent is ready to mount
	* This function will populate the filter list to have the ability to display one of three options:
	* - All
	* - UPLOADED NOTES
	* - BOOKMARKED NOTES
	*/
	componentDidMount() {

		const email = localStorage.getItem('email');
		this.setState({email: email});
		//this code is recursive, only to save space.
		var iteration = 0;

		const setNotes = (view) => {
			if(iteration < 2){
			ax.get('/' + 'note' + '/_design/dashboard/_view/' + view + '?key=\"' + email + '\"')
				.then(res => {
						const viewArray = res.data.rows;

						for(var i = 0; i < viewArray.length; i++){
							var note = viewArray[i];
							note.value.field = "";
							//Converts note ratings to JSON

							if(Object.prototype.toString.call(note.value.rating) === "[object Array]"){
								var newrating = {};
								for(var j = 0; j < note.value.rating.length; j++){
									newrating[note.value.rating[j].uniqueID] = note.value.rating[j].rating;
								}
								note.value.rating = newrating;
							}
							if(note.value.folder != undefined){
									var folders = this.state.folders;
									var folder = note.value.folder[this.state.email];
									if(folder == '' || folder == undefined){
										folder = this.state.email;
									}
									if(!folders.includes(folder)){
										folders.push(folder);
										folders = orderBy(folders, [folder => folder.toLowerCase()]);
										this.setState({ folders: folders });
									}
									note.value.folder[this.state.email] = folder;
							}
							else{
								note.value.folder = {};
								note.value.folder[this.state.email] = this.state.email;
							}
							viewArray[i] = note;
						}

						var itemsArray = this.state.items;
						itemsArray.push.apply(itemsArray, viewArray);

						itemsArray = orderBy(itemsArray, [note => note.value.title.toLowerCase()]);
						this.setState({ items: itemsArray });
						this.setState({ filteredItems: itemsArray });
						this.setState({ viewItems: itemsArray });
						this.setState({ sortedItems: itemsArray });
						switch(view) {
							case 'mynotes':
								this.setState({ uploadedNotes: viewArray });
								break;
							case 'bookmarked':
								this.setState({ bookmarkedNotes: viewArray });
								break;
						}
						iteration++;
						setNotes('bookmarked');
			});
			}
			else{
				ax.get('/' + 'group' + '/_design/dashboard/_view/' + 'mygroups' + '?key=\"' + email + '\"')
					.then(res => {
							const groupsArray = res.data.rows;
							this.setState({ myGroups: groupsArray });
					});
			}
		}
				setNotes('mynotes');

	}


	/**
	 *	RENDER
	 *	This Renders the List from "class List" with options to
	 *  view and sort items, as well as a user input filter
	 */
	render() {
    const email = this.state.email;
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
					  <AppBar
							position="static"
							color="default"
							elevation= {0}

						>
							<Tabs
								fullWidth
								indicatorColor="secondary"
								centered
							>

							<ConfirmationModal
                disabled={!(this.state.selectedItems.length > 0)}
								modalHeader="Perminantly Delete?"
								message=
								{<div><p>Are you sure you want to perminantly remove the following notes?</p>
									{this.state.items.map(item =>
										<Row key={item.id}>
										{this.state.selectedItems.includes(item.id) &&
										<MUIButton
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
										</MUIButton>
										}
									</Row>
								)}
											</div>
								}
								onClick={this.onDeleteItems.bind(this)}
								confirm={this.state.deleteStatus}
							>
								<Tab
									icon={<DeleteIcon />}
									className="darklink"
									label="Delete"
                  disabled={!(this.state.selectedItems.length > 0)}
								/>
							</ConfirmationModal>
							<ConfirmationModal
                disabled={!(this.state.selectedItems.length > 0)}
								modalHeader={this.state.newFolder}
								message=
								{<div>
									<TextField
										required
										autoFocus
			          		id="folderName"
			          		label={this.state.newFolder}
					          type="input"
										margin="normal"
										className="filter"
										fullWidth
										autoComplete='off'
										onChange={this.onFolderNameChange.bind(this)}
          					InputProps={{
            					startAdornment: <InputAdornment position="start"><NewFolderIcon /></InputAdornment>,
          					}}
			        		/>
								<br/>
								<p>This <b>folder</b> will contain:</p>
									{this.state.items.map(item =>
										<Row key={item.id}>
										{this.state.selectedItems.includes(item.id) &&
										<MUIButton
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
										</MUIButton>
										}
									</Row>
								)}
											</div>
								}
								onClick={this.onNewFolder.bind(this)}
								confirm={this.state.folderStatus}
							>
								<Tab
									icon={<NewFolderIcon />}
									className="darklink"
									label={this.state.newFolder}
                  disabled={!(this.state.selectedItems.length > 0)}
								/>
						</ConfirmationModal>
						<ConfirmationModal
              disabled={!(this.state.selectedItems.length > 0)}
							modalHeader="Share Items"
							message=
							{<div>
								<MuiThemeProvider theme={theme}>
									<p>Which Group Would You Like To Share Notes With?</p>
										{this.state.myGroups.map(group =>
											<div key={group.id}>
											<Row>
											<Col xs={{ size: 1 }}>
												<FormControlLabel
													control={
														<Checkbox

															color="default"
															id={group.id}
															checked={this.state.shareGroupSelect == group.id}
															onChange={this.onShareGroupSelected.bind(this)}
														/>
													}
												/>
											</Col>
											<Col xs={{ size: 11 }}>
											<MUIButton
												variant="contained"
												color="secondary"
												fullWidth
												classes={{
													root: 'button',
													label: 'buttonLabel'
												}}
												onClick={(e) => {
													this.setState({ shareGroupSelect: {group}.group.id.toLowerCase()});
												}}

											>
											<span className='buttonLabel' >
												<MyGroupIcon />
												<span>
													{group.value.title} <br/>
												</span></span>
											</MUIButton>
										</Col>
									</Row>
									</div>
									)}
									<FormControlLabel
		          			control={
		            			<Switch
		              			checked={this.state.keepFolders}
		              			onChange={this.keepFoldersChange.bind(this)}
		              			color="primary"
		            			/>
		          			}
		          			label="Keep Items In Folders"
		        			/>
							<ExpansionPanel>
        				<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          				<Typography>See Selected Items</Typography>
        				</ExpansionPanelSummary>
        				<ExpansionPanelDetails>
								<Col xs={{ size: 12 }}>
									{this.state.items.map(item =>
										<Row key={item.id}>
										{this.state.selectedItems.includes(item.id) &&
										<MUIButton
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
										</MUIButton>
											}
										</Row>
									)}
								</Col>
        				</ExpansionPanelDetails>
      				</ExpansionPanel>
								</MuiThemeProvider>
								</div>
							}
							onClick={this.onShareWithGroup.bind(this)}
							confirm={this.state.shareStatus}
						>
								<Tab
									icon={<AddToGroupIcon />}
									className="darklink"
									label="Share"
                  disabled={!(this.state.selectedItems.length > 0)}
								/>
						</ConfirmationModal>
						<ConfirmationModal
              disabled={!(this.state.selectedItems.length > 0)}
							modalHeader="Move Items"
							message=
							{<div>
									<p>Select Which Folder To Move Items Into:</p>
										{this.state.folders.map(title =>
											<div key={title}> {title != this.state.email &&
											<Row>
											<Col xs={{ size: 1 }}>
												<FormControlLabel
													control={
														<Checkbox

															color="default"
															id={title}
															checked={this.state.moveFolderSelect == title}
															onChange={this.onMoveFolderSelected.bind(this)}
														/>
													}
												/>
											</Col>
											<Col xs={{ size: 11 }}>
											<MUIButton
												variant="contained"
												color="primary"
												fullWidth
												classes={{
													root: 'button',
													label: 'buttonLabel'
												}}
												onClick={(e) => {
													this.setState({ moveFolderSelect: {title}.title.toLowerCase()});
												}}

											>
											<span className='buttonLabel' >
												<FolderIcon />
												<span>
													{title} <br/>
												</span></span>
											</MUIButton>
										</Col>
									</Row>}
									</div>
									)}
									<div key={this.state.email}>
									<Row>
									<Col xs={{ size: 1 }}>
										<FormControlLabel
											control={
												<Checkbox

													color="default"
													id={this.state.email}
													checked={this.state.moveFolderSelect == this.state.email}
													onChange={this.onMoveFolderSelected.bind(this)}
												/>
											}
										/>
									</Col>
									<Col xs={{ size: 11 }}>
									<MUIButton
										variant="outlined"
										color="primary"
										fullWidth
										classes={{
											root: 'button',
											label: 'buttonLabel'
										}}
										onClick={(e) => {
											this.setState({ moveFolderSelect: {email}.email.toLowerCase()});
										}}

									>
									<span className='buttonLabel' >
										<span>
											No Folder
										</span></span>
									</MUIButton>
								</Col>
							</Row>
							</div>
							<ExpansionPanel>
        				<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          				<Typography>See Selected Items</Typography>
        				</ExpansionPanelSummary>
        				<ExpansionPanelDetails>
								<Col xs={{ size: 12 }}>
									{this.state.items.map(item =>
										<Row key={item.id}>
										{this.state.selectedItems.includes(item.id) &&
										<MUIButton
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
										</MUIButton>
											}
										</Row>
									)}
								</Col>
        				</ExpansionPanelDetails>
      				</ExpansionPanel>

								</div>
							}
							onClick={this.onMoveToFolder.bind(this)}
							confirm={this.state.moveStatus}
						>
								<Tab
									icon={<MoveIcon />}
									className="darklink"
									label="Move"
                  disabled={!(this.state.selectedItems.length > 0)}
								/>
						</ConfirmationModal>
							</Tabs>
						</AppBar>
        <br/>
					<ul>
						{this.state.folders.map(title =>
							<div key={title}> {title != this.state.email &&
							<Row>
							<Col xs={{ size: 1 }}>
								<FormControlLabel
									control={
										<Checkbox

											color="default"
											id={title}
											checked={this.state.selectedFolders.includes(title)}
											onChange={this.onSelectedFolder.bind(this)}
										/>
									}
								/>
							</Col>
							<Col xs={{ size: 11 }}>
							<MUIButton
								variant={this.state.openFolder == title ? "outlined" : "contained"}
								color="primary"
								fullWidth
								classes={{
									root: 'button',
									label: 'buttonLabel'
								}}
								onClick={(e) => {
									var openFolder = {title}.title;
									this.state.openFolder == openFolder ?
									this.setState({ openFolder: this.state.email}) :
									this.setState({ openFolder: openFolder})
								}
								}
							>
							<span className='buttonLabel' >
								{this.state.openFolder == title ? <OpenFolderIcon /> : <FolderIcon />}
								<span>
									{title} <br/>
								</span></span>
							</MUIButton>
						</Col>
						{this.state.openFolder == title &&
							<Col xs={{ size: 11, offset: 1 }}>
								{this.state.filteredItems.map(item =>
									<div key={item.id}>
										{item.value.folder[this.state.email] == title &&
											<Row>
											<Col xs={{ size: 1 }}>
												<FormControlLabel
		          						control={
		            						<Checkbox

		              						color="default"
															id={item.id}
															checked={this.state.selectedItems.includes(item.id)}
															onChange={this.onSelectedItem.bind(this)}
		            						/>
		          						}
		        						/>
											</Col>
											<Col xs={{ size: 10 }}>
											<MUIButton
												variant="outlined"
												color="primary"
												fullWidth
												classes={{
													root: 'button',
		        							label: 'buttonLabel'
		      							}}
                        component={Link} to={`/note/${item.id}`}
											>
											<span className='buttonLabel' >
												{item.value.label === 'mynotes' && <UploadedNoteIcon />}
												{item.value.label === 'bookmarked' && <BookmarkedNoteIcon />}
												<span>
													{item.value.title} <br/>
													{this.state.field} {item.value.field}
												</span></span>
											</MUIButton>
										</Col>
									</Row>
								}
							</div>
										)}
						</Col>}
					</Row>}
				</div>
						)}

						{this.state.filteredItems.map(item =>
							<div key={item.id}>
								{item.value.folder[this.state.email] == this.state.email &&
									<Row>
									<Col xs={{ size: 1 }}>
										<FormControlLabel
          						control={
            						<Checkbox

              						color="default"
													id={item.id}
													checked={this.state.selectedItems.includes(item.id)}
													onChange={this.onSelectedItem.bind(this)}
            						/>
          						}
        						/>
									</Col>
									<Col xs={{ size: 11 }}>
									<MUIButton
										variant="outlined"
										color="primary"
										fullWidth
										classes={{
											root: 'button',
        							label: 'buttonLabel'
      							}}
                    component={Link} to={`/note/${item.id}`}
									>
									<span className='buttonLabel' >
										{item.value.label === 'mynotes' && <UploadedNoteIcon />}
										{item.value.label === 'bookmarked' && <BookmarkedNoteIcon />}
										<span>
											{item.value.title} <br/>
											{this.state.field} {item.value.field}
										</span>
									</span>
									</MUIButton>
								</Col>
							</Row>
					}
							</div>
								)}
					</ul>
					</Col>
				</Row>
			</Container>}
			</div>
    );
	}
}
