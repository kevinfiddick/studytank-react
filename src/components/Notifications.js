import React, {Fragment} from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import ax from './api';
import './Form.css';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import {Container, Row, Col} from "reactstrap";


export default class Notifications extends React.Component {

    constructor() {
        super();
        this.state = {
          email: '',
          notifications: [],
          user: {}
        };
    }

    componentDidMount(){
      const email = localStorage.getItem('email');
  		this.setState({email: email});

      ax.get('/' + 'user' + '/' + email)
        .then(res => {
            var user = res.data;
            for(var i = 0; i< user.notifications.length; i++){
              var notification = user.notifications[i];
              delete notification.title;
              if(!notification.hasOwnProperty('id')){
                notification.id = notification.uniqueID;
                delete notification.uniqueID;
              }
	            if(!notification.hasOwnProperty('seen')){
	              notification.status == 'seen' ? notification.seen = true :  notification.seen = false;
	              delete notification.status;
              }
              console.log(notification);
              user.notifications[i] = notification;
            }
            this.setState({notifications: user.notifications});
            this.setState({user: user});
        });
    }

    componentWillUnmount(){
      var user = this.state.user;
      for(var i = 0; i< user.notifications.length; i++){
        var notification = user.notifications[i];
        notification.seen = true;
        user.notifications[i] = notification;
      }
      if(!user.hasOwnProperty('username')){
        user.username =
          user.firstname.trim().replace(/\s/g,'-').toLowerCase() + '-' + user.lastname.trim().replace(/\s/g,'-').toLowerCase();
      }
      ax({
        method: 'post',
        url: '/user',
        data: {
          _id: user._id,
          _rev: user._rev,
          email: user.email,
          username: user.username,
          password: user.password,
          firstname: user.firstname,
          lastname: user.lastname,
          school: user.school,
          notifications: user.notifications
        }
      });
    }

    render() {
            return (
        			<div>
        			{this.state.notifications.length !== 0 &&
        			<Container>
      				<Row>
      					<Col md={{ size: 8, offset: 2 }} xs={{ size: 12, offset: 0 }}>
        				<br/>
                {this.state.notifications.slice(0).reverse().map(notification =>
                  <div key={notification.id}>
                  <Grid container spacing={24}>
                  <Grid item xs={12} sm={12} component={Link} to={`/${notification.page}/${notification.linkID}`}>
                {notification.seen === false &&
                <Paper className="notification" elevation={2} style={{backgroundColor: '#ffffcc'}}>
                  <Typography>
                    <div dangerouslySetInnerHTML={{ __html: notification.phrase }} />
                  </Typography>
                  <Typography>
                    Click to view {notification.page}
                  </Typography>
                </Paper>}
                {notification.seen === true &&
                <Paper className="notification" elevation={2} style={{backgroundColor: '#f2f2f2'}}>
                  <Typography>
                    <div dangerouslySetInnerHTML={{ __html: notification.phrase }} />
                  </Typography>
                  <Typography>
                    Click to view {notification.page}
                  </Typography>
                </Paper>}
                  </Grid>
                  </Grid>
                  </div>)}
                  </Col>
              </Row>
              </Container>}
              <br/>
              <br/>
              </div>
            );
    }
}
