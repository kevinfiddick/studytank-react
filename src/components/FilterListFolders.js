import React from 'react';
import ax from './api';
import ConfirmationModal from './ConfirmationModal';
import MUIButton from '@material-ui/core/Button';
import {Container, Row, Col} from "reactstrap";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import sortBy from 'lodash/sortBy';
import pullAllBy from 'lodash/pullAllBy';
import {Link} from 'react-router-dom';
import './FilterList.css'
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import DeleteIcon from "@material-ui/icons/DeleteForever";
import NewFolderIcon from "@material-ui/icons/CreateNewFolder";
import AddToGroupIcon from "@material-ui/icons/GroupAdd";
import Tooltip from '@material-ui/core/Tooltip';

import UploadedNoteIcon from "@material-ui/icons/InsertDriveFile";
import BookmarkedNoteIcon from "@material-ui/icons/BookmarkBorder";
import FolderIcon from "@material-ui/icons/Folder";

const smallFont = { fontSize: '12px' };

/** TODO:
	(1)	Get Username from localStorage!
	(2) Sort by Date Uploaded!
	(3) Sort by Rating!
	(4) Add delete button functionality to delete selected Notes
	(5) Add folder button functionality to add selected Notes to a folder
	(6) Add group button functionality to add selected Notes to a group
	(7) Add cut and paste functionality (cut to session storage paste from session storage)
	(8) Render Folders with FolderIcon
**/

export default class FilterNoteList extends React.Component {
	state = {};

	/**
	 *	ON ITEM SELECTION
	 *	This function is called when a checkbox is changed
	 *
	 */
	 onSelectedItem(e){
		 var selectedItems = this.state.selectedItems;

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

		 this.setState({selectedItems: selectedItems});
	 }

	 onDeleteItems(e){
		 this.setState({deleteStatus: "Deleting..."});
		 var deleteIDs = this.state.selectedItems;
		 var i = 0;
		 var recursiveDelete = () => {
			if(i < deleteIDs.length) {
			 var deleteID = deleteIDs[i];
			 ax.get('/' + 'note' + '/' + deleteID).then(result => {
				 if(result.data.author === this.state.username){
			 		ax.delete('/' + 'note' + '/' + deleteID + '?rev=' + result.data._rev )
			 			.then(res => {
							i++;
							recursiveDelete();
			 			});
					}else{
						var note = result.data;
						var index = note.saved.indexOf(this.state.username);
						note.saved.splice(index, 1);


						note.exclusive == undefined ? note.exclusive = false : null;
						note.courses == undefined ? note.courses = {} : null;
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

	 onNewFolder(e){
	 		 this.setState({deleteStatus: "Deleting..."});
	 		 var deleteIDs = this.state.selectedItems;
	 		 var i = 0;
	 		 var recursiveDelete = () => {
	 			if(i < deleteIDs.length) {
	 			 var deleteID = deleteIDs[i];
	 			 ax.get('/' + 'note' + '/' + deleteID).then(result => {
	 				 if(result.data.author === this.state.username){
	 			 		ax.delete('/' + 'note' + '/' + deleteID + '?rev=' + result.data._rev )
	 			 			.then(res => {
	 							i++;
	 							recursiveDelete();
	 			 			});
	 					}else{
	 						var note = result.data;
	 						var index = note.saved.indexOf(this.state.username);
	 						note.saved.splice(index, 1);

							note.exclusive == undefined ? note.exclusive = false : null;
							note.courses == undefined ? note.courses = {} : null;
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

 /**
	*	COMP WILL MOUNT
	*	This function is called when the Compounent is ready to mount
	* This function will populate the filter list to have the ability to display one of three options:
	* - All
	* - UPLOADED NOTES
	* - BOOKMARKED NOTES
	*/
	componentDidMount() {
		//TODO: catch param username (email address of user)
		const setNotes = (view) => {
			const email = localStorage.getItem('email');
			this.setState({username: email});
			ax.get('/' + 'note' + '/_design/dashboard/_view/' + view + '?startkey=\"' + email + '\"&endkey=\"' + email + 'Z\"')
				.then(res => {
						const viewArray = res.data.rows;
						const itemsArray = this.state.items;
						itemsArray.push.apply(itemsArray, viewArray);
						this.setState({ items: itemsArray });
						this.setState({ filteredItems: itemsArray });
						this.setState({ viewItems: itemsArray });
						const sortedArray = itemsArray;
						for(var i = 0; i < sortedArray.length; i++){
							var note = sortedArray[i];
							note.value.field = "";
							sortedArray[i] = note;
							if(!this.state.folders.includes(note.key)){
								var folders = this.state.folders;
								folders.push(note.key);
								this.setState({ folders: folders });
							}
						}
						this.setState({ sortedItems: itemsArray });
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
					{this.state.selectedItems.length > 0 && <AppBar
							position="static"
							color="default"
							elevation= {0}

						>
							<Tabs
								value={this.state.value}
								fullWidth
								indicatorColor="secondary"
								centered
							>

            <Tooltip disableFocusListener title="Delete">
							<ConfirmationModal
								modalHeader="Confirm"
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
								/>
							</ConfirmationModal>
						</Tooltip>
						<Tooltip disableFocusListener title="Create New Folder">
							<ConfirmationModal
								modalHeader="Create Folder"
								message=
								{<div>
									<TextField
			          		id="folderName"
			          		label="New Folder"
					          type="input"
										margin="normal"
										className="filter"
										fullWidth
										autoComplete='off'
          					InputProps={{
            					startAdornment: <InputAdornment position="start"><NewFolderIcon /></InputAdornment>,
          					}}
			        		/>
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
								/>
						</ConfirmationModal>
						</Tooltip>
						<Tooltip disableFocusListener title="Add To Group">
								<Tab
									icon={<AddToGroupIcon />}
									className="darklink"
								/>
						</Tooltip>
								<Tab
									label={<span style={smallFont}>Cut</span>}
									className="darklink"
								/>
							</Tabs>
						</AppBar>
					}
			<br/>
				<Typography variant="display1" gutterBottom>
	        {this.state.currentFolder}
	      </Typography>
							<ul>
								{this.state.filteredItems.map(item =>
									<Row key={item.id}>
									<Col xs={{ size: 1 }}>
										<FormControlLabel
          						control={
            						<Checkbox
              						value="checkedB"
              						color="default"
													id={item.id}
													checked={this.state.selectedItems.includes(item.id)}
													onChange={this.onSelectedItem.bind(this)}
            						/>
          						}
        						/>
									</Col>
									<Col xs={{ size: 11 }}>
								{item.key == this.state.username ?
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
								:
								<MUIButton
									variant="contained"
									color="primary"
									fullWidth
									classes={{
										root: 'button',
										label: 'buttonLabel'
									}}

								>
								<span className='buttonLabel' >
									{item.value.label === 'mynotes' && <FolderIcon />}
									{item.value.label === 'bookmarked' && <FolderIcon />}
									<span>
										{item.value.title} <br/>
										{this.state.field} {item.value.field}
									</span></span>
								</MUIButton>
							}
								</Col>
							</Row>
								)}
							</ul>
					</Col>
				</Row>
			</Container>}
			</div>
    );
	}
}
