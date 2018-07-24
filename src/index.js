import React from 'react'
import ReactDOM from 'react-dom'
import find from 'lodash.find'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import NavBar from './components/NavBar'
import FilterGroupList from './components/FilterGroupList'
import Dashboard from './components/dashboard'
import Assessment from './components/assessment'
import RegisterForm from './components/registerform'
import Assessments from './assessment-bank.json'
import 'bootstrap/dist/css/bootstrap.css';

const RegisterPage = ({ match }) => (
  <div>
    <NavBar/>
    <FilterGroupList/>
  </div>
)

const DashboardPage = ({ match }) => (
  <div>
    <NavBar/>
    <Dashboard />
  </div>
)

const NotificationsPage = ({ match }) => (
  <div>
    <NavBar/>
    <Dashboard />
  </div>
)

const AssessmentsPage = ({ match }) => (
  <div>
    <NavBar/>
    <Dashboard />
  </div>
)

const SearchPage = ({ searchterm, match }) => (
  <div>
    <NavBar/>
    <Dashboard />
  </div>
)

const App = () => (
  <Router>
    <div>
      <Switch>
        <Route path='/register' component={RegisterPage} />
        <Route path='/dashboard' component={DashboardPage} />
        <Route path='/notifications' component={NotificationsPage} />
        <Route path='/assessments' component={AssessmentsPage} />
        <Route path='/search?q=:id' component={SearchPage} />

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
