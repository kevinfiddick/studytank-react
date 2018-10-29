import React from 'react';
import ax from './api';
import Button from '@material-ui/core/Button';
import {Container, Row, Col} from "reactstrap";
import {Link} from 'react-router-dom';
import './FilterList.css'
import './Link.css'
import TextField from '@material-ui/core/TextField';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
	overrides: {
      MuiButton: {
        root: {
          marginTop: 4,
        }
      }
    }
});

export default class FilterSubjectList extends React.Component {
	state = {
				subjects: [],
				filteredItems: [],
	};

	onFilterInputChange(e){

    const updatedList = this.state.subjects.filter(function(item){
      return (item.search(
        e.target.value.toLowerCase()) !== -1);
    });
    this.setState({ filteredItems: updatedList });
  }


	componentDidMount() {
		let that = this;
			ax.get('/' + 'note' + '/_design/search/_view/search')
				.then(res => {
						const subjects = [];
						const notes = res.data.rows;
						for(var i = 0; i < notes.length; i++){
							var subject = notes[i].key.toLowerCase();
							if(!subjects.includes(subject)) subjects.push(subject);
						}
						ax.get('/' + 'group' + '/_design/search/_view/search')
							.then(results => {
									const groups = results.data.rows;
									for(var i = 0; i < groups.length; i++){
										var subject = groups[i].key.toLowerCase();
										if(!subjects.includes(subject)) subjects.push(subject);
									}

									subjects.sort();
									that.setState({ subjects: subjects });
									that.setState({ filteredItems: subjects });

							});
				});
	}


	render() {
		return(
			<Container>
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
									<div key={item}>
										<Row>
											<Col xs={{ size: 12 }}>
									<Button
										variant="outlined"
										color="primary"
										fullWidth
                    component={Link} to={`/subject/${item}`}
									>
									<span>
											{item}
									</span>
									</Button>
								</Col>
									</Row>
									</div>
								)}
							</ul>
							</MuiThemeProvider>
					</Col>
				</Row>
			</Container>
    );
	}
}
