import React from 'react';
import ax from './api';
import SecondaryNavBar from './SecondaryNavBar';
import LogInForm from './LogInForm';
import RegisterForm from './RegisterForm';

export default class Authentification extends React.Component {
	state = {
    email: '',
    content: ''
	};

 /**
	*	COMP WILL MOUNT
	*	This function is called when the Compounent is ready to mount
	* This function will populate the filter list to have the ability to display one of three options:
	* - All
	* - UPLOADED NOTES
	* - BOOKMARKED NOTES
	*/
	componentWillMount() {
    //checks if localStorage is expired
    const MONTH_IN_MS = 2678400000;
    var expiration = 0;
    var grace = 3 * MONTH_IN_MS;
    var email = '';
    var password = '';
    //save local storage email and password for easy access
    try{
        email = localStorage.getItem("email");
        password = localStorage.getItem("password");
        expiration = localStorage.getItem("expires");
        if(expiration < Date.now()){
            localStorage.clear();
            this.setState({content: 'login'});
        }
        else{
            localStorage.setItem("expires", Date.now() + grace);
            ax.get('/' + 'user' + '/' + email)
      				.then(res => {
                if (res.data.password === password) {
                  this.setState({email: email});
                  this.setState({content: 'children'});
									var user = res.data;
	                  localStorage.setItem('email', user.email);
	                  localStorage.setItem('password', user.password);
	                  localStorage.setItem('firstname', user.firstname);
	                  localStorage.setItem('lastname', user.lastname);
	                  localStorage.setItem('school', user.school);
	                  if(!user.hasOwnProperty('username')){
	                    user.username =
	                      user.firstname.trim().replace(/\s/g,'-').toLowerCase() + '-' + user.lastname.trim().replace(/\s/g,'-').toLowerCase();
	                  }
	                  localStorage.setItem('username', user.username);

	                  const MONTH_IN_MS = 2678400000;
	                  var grace = 3 * MONTH_IN_MS;
	                  localStorage.setItem('expires', Date.now() + grace);
                }
                else{
				          localStorage.clear();
                  this.setState({content: 'login'});
                }
      				})
              .catch(c => {
                  this.setState({content: 'login'});
              });
      	}
    }catch(e){
      this.setState({content: 'login'});
    }
	}

	/**
	 *	RENDER
	 *	This Renders the List from "class List" with options to
	 *  view and sort items, as well as a user input filter
	 */
	render() {
		return(
      <div>
        {this.state.content === 'children' && this.props.children}
        {this.state.content === 'login' && <div><SecondaryNavBar subpath='login'/><LogInForm/></div>}
        {this.state.content === 'register' && <div><SecondaryNavBar subpath='register'/><RegisterForm/></div>}
      </div>
    );
	}
}
