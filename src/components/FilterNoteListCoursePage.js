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

import RemoveIcon from "@material-ui/icons/Delete";
import NewFolderIcon from "@material-ui/icons/CreateNewFolder";
import AddNotesIcon from "@material-ui/icons/NoteAdd";
import MoveIcon from "@material-ui/icons/FormatListBulleted";

import NoteIcon from "@material-ui/icons/Description";
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

const smallFont = { fontSize: '12px' };

export default class FilterNoteList extends React.Component {
	state = {
		    items: [],
				filteredItems: [],
				sortedItems: [],
				folders: [],
				email: '',
				field: '',
				view: 'all',
				sort: 'abc',
				openFolder: '',
        filter: null
	};

	/**
	 *	ON FILTER INPUT CHANGE
	 *	This function is called when the "Filter" input box is changed
	 *  This function will change the filter list to display only what
	 *  matches user input.
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
	*	ON SELECT SORT CHANGE
	*	This function is called when the "Sort By: " select box is changed
	* This function will call sortChange
	*
  */
	onSortChange(e){
		const sort = e.target.value;
		const list = this.state.items;

		this.sortChange(sort, list);
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
			 var folderID = item.value.folder[this.props.id];
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
           if(!addFolder.includes(folderID) && folderID != this.props.id){
             addFolder.push(folderID);
           }
         }
         if(!selectedFolders.includes(folderID) && !selectedItems.includes(item.id)){
           if(!nullFolder.includes(folderID) && folderID != this.props.id){
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
					 if(item.value.folder[this.props.id] == folderID){
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
					 if(item.value.folder[this.props.id] == folderID){
						 removeItems.push(item.id);
					 }
				 }
				 selectedItems = selectedItems.filter(r => !removeItems.includes(r));

				 selectedFolders = foldersCopy;
	 		 }

			 this.setState({selectedFolders: selectedFolders});
	 		 this.setState({selectedItems: selectedItems});
	 	 }

	 onRemoveItems(e){
		 this.setState({removeStatus: <span>Removing... <CircularProgress /></span>});
		 var removeIDs = this.state.selectedItems;
		 var i = 0;
		 var recursiveRemove = () => {
			if(i < removeIDs.length) {
			 var removeID = removeIDs[i];
			 ax.get('/' + 'note' + '/' + removeID).then(result => {
						var note = result.data;
						var index = note.saved.indexOf(this.props.id);
						note.saved.splice(index, 1);
						note.folder == undefined ? note.folder = {} : delete note.folder[this.props.id];
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
  							_attachments: note._attachments
							}
						}).then(res => {
							i++;
							recursiveRemove();
						});
			 });
		  }else{
				window.location.reload();
		  }
		 }
		 recursiveRemove();
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
					 note.folder[this.props.id] = folderName;
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
					 note.folder[this.props.id] = folderName;
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
    this.setState({ filter: this.props.filter });
		this.setNotes();

	}
  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (!this.isEqual(nextProps.filter, this.state.filter)) {
			var filterArray = [];
			filterArray = filterArray.concat(nextProps.filter);
      this.setState({ filter: filterArray });
			this.setNotes();
    }
  }

	diff(arr1, arr2){
		var ret = [];
		for(var i in arr1) {
				if(arr2.indexOf(arr1[i]) > -1){
						ret.push(arr1[i]);
				}
		}
		return ret;
	}

	isEqual(a, b){
		if (a === b) return true;
  	if (a == null || b == null) return false;
  	if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  	for (var i = 0; i < a.length; ++i) {
    	if (a[i] !== b[i]) return false;
  	}
  	return true;
	}

	setNotes(){
		this.setState({ folders: [] });

		this.setState({ items: [] });
		this.setState({ filteredItems: [] });
		this.setState({ sortedItems: [] });
		ax.get('/' + 'note' + '/_design/course/_view/outcomes?key="' + this.props.id + '"')
			.then(res => {
					const viewArray = res.data.rows;

					for(var i = 0; i < viewArray.length; i++){
						var note = viewArray[i];

						if(this.props.filter.length == 0 || this.diff(this.props.filter, note.value.outcomes).length > 0){

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
									var folder = note.value.folder[this.props.id];
									if(folder == '' || folder == undefined){
										folder = this.props.id;
									}
									if(!folders.includes(folder)){
										folders.push(folder);
										folders = orderBy(folders, [folder => folder.toLowerCase()]);
										this.setState({ folders: folders });
									}
									note.value.folder[this.props.id] = folder;
							}
							else{
								note.value.folder = {};
								note.value.folder[this.props.id] = this.props.id;
							}
							viewArray[i] = note;
						}
					}

					var itemsArray = this.state.items;
					itemsArray.push.apply(itemsArray, viewArray);

					itemsArray = orderBy(itemsArray, [note => note.value.title.toLowerCase()]);

					this.setState({ items: itemsArray });
					this.setState({ filteredItems: itemsArray });
					this.setState({ sortedItems: itemsArray });
		});
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
				<Row>
					<Col md={{ size: 5, offset: 2 }} xs={{ size: 7, offset: 0 }}>
  						<TextField
            		id="filterInput"
            		label="Filter"
  		          type="search"
  							className="filter"
  							onChange={this.onFilterInputChange.bind(this)}
  							fullWidth
  							autoComplete='off'
          		/>
					</Col>
					<Col md={{ size: 3, offset: 0 }} xs={{ size: 5, offset: 0 }}>
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
            <br/>

					<ul>
						{this.state.folders.map(title =>
							<div key={title}> {title != this.props.id &&
							<Row>
							<Col xs={{ size: 12 }}>
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
									this.setState({ openFolder: this.props.id}) :
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
										{item.value.folder[this.props.id] == title &&
											<Row>
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
												<NoteIcon /> {' '}
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
								{item.value.folder[this.props.id] == this.props.id &&
									<Row>
									<Col xs={{ size: 12 }}>
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
										<NoteIcon /> {' '}
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
