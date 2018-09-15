import React from 'react';
import Button from '@material-ui/core/Button';
import {Container, Row, Col} from "reactstrap";
import GroupPageNoteList from './FilterNoteListGroupPage';
import ax from './api';

export default class FilterNoteList extends React.Component {
  state = {
  };
  componentDidMount() {

	}
  render() {
		return(
			<div>
        <GroupPageNoteList id={this.props.id} />
      </div>
    );
	}
}
