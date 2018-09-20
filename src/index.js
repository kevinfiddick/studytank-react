import React from 'react'
import ReactDOM from 'react-dom'
import find from 'lodash.find'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Authentification from './components/Authentification'
import NavBar from './components/NavBar'
import SecondaryNavBar from './components/SecondaryNavBar'
import DashboardNavBar from './components/DashboardNavBar'
import DashboardButton from './components/DashboardButton'
import FilterGroupList from './components/FilterGroupList'
import FilterNoteList from './components/FilterNoteList'
import Heading from './components/Heading'
import Info from './components/Info'
import Assessment from './components/assessment'
import RegisterForm from './components/RegisterForm'
import LogInForm from './components/LogInForm'
import LogOff from './components/LogOff'
import Payroc from './components/Payroc'
import CreateGroup from './components/CreateGroup'
import Group from './components/GroupPage'
import CreateNote from './components/CreateNote'
import ProfileSettings from './components/ProfileSettings'
import Logo from './components/Logo'
import Notifications from './components/Notifications'
import 'bootstrap/dist/css/bootstrap.css';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
	   primary: {
       light: '#757575',
       main: '#616161',
       dark: '#424242',
       contrastText: '#fff',
	   },
	   secondary: {
	     light: '#00796B',
	     main: '#FF6F00',
	     dark: '#E65100',
	     contrastText: '#fff',
	   }
  }
});

const PayrocPage = ({ match }) => (
  <div>
    <Payroc/>
  </div>
)

const RegisterPage = ({ match }) => (
  <div>
    <NavBar pathname='register'/>
    <SecondaryNavBar subpath='register'/>
    <RegisterForm/>
  </div>
)

const LogInPage = ({ match }) => (
  <div>
    <NavBar pathname='login'/>
    <SecondaryNavBar subpath='login'/>
    <LogInForm/>
  </div>
)

const DashboardNotesPage = ({ match }) => (
  <div>
    <NavBar pathname='dashboard'/>
    <Authentification>
      <DashboardNavBar subpath='notes'/>
      <Heading>Notes</Heading>
      <Info>Here is where you will find all the Notes that you've Uploaded or Bookmarked</Info>
      <DashboardButton color='primary' linkTo='/create/note' label='Upload New Note'/>
      <FilterNoteList/>
    </Authentification>
  </div>
)

const DashboardGroupsPage = ({ match }) => (
  <div>
    <NavBar pathname='dashboard'/>
    <Authentification>
    <DashboardNavBar subpath='groups'/>
    <Heading>Groups</Heading>
    <Info>Here is where you will find the Groups that you've Created or Followed</Info>
    <MuiThemeProvider theme={theme}>
    <DashboardButton color='secondary' linkTo='/create/group' label='Create New Group'/>
      <FilterGroupList/>
    </MuiThemeProvider>
  </Authentification>
  </div>
)

const DashboardSettingsPage = ({ match }) => (
  <div>
    <NavBar pathname='dashboard'/>
    <Authentification>
    <DashboardNavBar subpath='settings'/>
    <Heading>Settings</Heading>
    <MuiThemeProvider theme={theme}>
    <DashboardButton color='primary' linkTo='/faq' label='Frequently Asked Questions'/>
    </MuiThemeProvider>
    <ProfileSettings />
  </Authentification>
  </div>
)

const DashboardLogOffPage = ({ match }) => (
  <div>
    <NavBar pathname='dashboard'/>
    <Authentification>
    <DashboardNavBar subpath='exit'/>
    <Heading>Are You Sure You Want To Log Off?</Heading>
    <LogOff />
  </Authentification>
  </div>
)

const CreateGroupPage = ({ match }) => (
  <div>
    <NavBar pathname='dashboard'/>
    <Authentification>
    <DashboardNavBar subpath='groups'/>
    <Heading>Create Group</Heading>
    <MuiThemeProvider theme={theme}>
    <DashboardButton color='secondary' linkTo='/dashboard/groups' label='Go Back'/>
    <br/><CreateGroup />
    </MuiThemeProvider>
  </Authentification>
  </div>
)

const CreateNotePage = ({ match }) => (
  <div>
    <NavBar pathname='dashboard'/>
    <Authentification>
    <DashboardNavBar subpath='notes'/>
    <CreateNote />
  </Authentification>
  </div>
)

const GroupPage = ({ match }) => (
    <div>
      <NavBar pathname='group'/>
      <br/><Group id={match.params.id}/>
    </div>
)

const NotificationsPage = ({ match }) => (
  <div>
    <NavBar pathname='notifications'/>
    <Authentification>
    <Heading>Notifications</Heading>
    <Notifications />
      </Authentification>
  </div>
)

const AssessmentsPage = ({ match }) => (
  <div>
    <NavBar pathname='assessments'/>
    <Authentification>

    </Authentification>

  </div>
)

const SearchPage = ({ searchterm, match }) => (
  <div>
    <NavBar pathname='search'/>
    <Logo />
  </div>
)

const App = () => (
  <Router>
    <div>
      <Switch>
        <Route path='/register' component={RegisterPage} />
        <Route path='/login' component={LogInPage} />
        <Route path='/dashboard/notes' component={DashboardNotesPage}/>
        <Route path='/dashboard/notes?' component={DashboardNotesPage}/>
        <Route path='/dashboard/groups' component={DashboardGroupsPage} />
        <Route path='/dashboard/groups?' component={DashboardGroupsPage} />
        <Route path='/dashboard/settings' component={DashboardSettingsPage} />
        <Route path='/dashboard/exit' component={DashboardLogOffPage} />
        <Route path='/create/group' component={CreateGroupPage} />
        <Route path='/create/note' component={CreateNotePage} />
        <Route path='/group/:id' component={GroupPage} />
        <Route path='/notifications' component={NotificationsPage} />
        <Route path='/assessments' component={AssessmentsPage} />
        <Route path='/search' component={SearchPage} />
        <Route path='/payroc' component={PayrocPage} />
        <Route path='' component={SearchPage} />
      </Switch>
    </div>
  </Router>
)

var render = () => {
  ReactDOM.render(
      <App />,
    document.getElementById('root')
  )
}

render()
