import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

const styles = theme => ({
  container: {
    flexWrap: 'wrap'
  },
  textField: {
    margin: '35px auto',
    display: 'block',
    padding: '35px',
    marginright: '150px',
    width: '50%'
  },
  menu: {
    margin: '50px auto'
  },
  root: {
    margin: '50px auto',
    display: 'inline-block',
    padding: '20px'
  },
  div: {
    margin: '35px auto',
    display: 'block',
    textAlign: 'center'
  },
  p: {
    textAlign: 'right'
  }
})

const TextFields = ({ classes }) => (
  <div className={classes.div}>
    <Paper className={classes.root} elevation={9}>
      <Typography variant='headline' component='h1'>
    Register
      </Typography>
      <form className={classes.container} noValidate autoComplete='off'>
        <TextField
          required
          id='firstname'
          label='Required'
          defaultValue='First Name'
          className={classes.textField}
          margin='normal'
        />
        <TextField
          required
          id='lastname'
          label='Last Name'
          defaultValue='Last Name'
          className={classes.textField}
          margin='normal'
        />
        <TextField
          required
          id='email'
          label='Email'
          defaultValue='MyEmail@something.com'
          className={classes.textField}
          margin='normal'
        />
        <TextField
          required
          id='phone-number'
          label='Phone Number'
          defaultValue='4145551234'
          type='number'
          className={classes.textField}
          margin='normal'
        />
        <TextField
          required
          id='zipcode'
          label='Zipcode'
          defaultValue='53233'
          type='number'
          className={classes.textField}
          margin='normal'
        />
        <TextField
          required
          id='birthday'
          label='Birthday'
          defaultValue='October 11, 1995'
          className={classes.textField}
          margin='normal'
        />
        <TextField
          id='password-input'
          label='Password'
          className={classes.textField}
          defaultValue='Type PassWord'
          type='password'
          autoComplete='current-password'
          margin='normal'
        />
        <TextField
          required
          id='confirm-password-input'
          label='Confirm Password'
          className={classes.textField}
          type='password'
          defaultValue='Confirm PassWord'
          autoComplete='current-password'
          margin='normal'
        />
        <Button variant='outlined' color='primary' className={classes.button}>
       Submit
        </Button>

      </form>
    </Paper>
  </div>
)

TextFields.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(TextFields)
