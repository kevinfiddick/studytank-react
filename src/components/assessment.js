import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import GetRequuest from './getComponent'

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

const start = Date.now()

const Assessment = ({ assessment, classes }) => (

  <div className={classes.div}>
    <Paper className={classes.root} elevation={23}>
      <p className={classes.p}>{assessment.taker}</p>

      <p onload={start} className={classes.p}>Date.n</p>

      <Typography variant='headline' component='h1'>
        {assessment.title}
      </Typography>
      <br />
      <Typography component='h2'>
      Created By:Tyler gottlieb
      </Typography>

      <form className={classes.container} noValidate autoComplete='off'>
        <TextField
          required
          id='coupon-title'
          label='Coupon Title'
          defaultValue='Coupon Title'
          className={classes.textField}
          margin='normal'
        />
        <TextField
          required
          id='short-description'
          label='Short description'
          multiline
          defaultValue='1-3 Sentance long description'
          className={classes.textField}
          margin='normal'
        />
        <TextField
          id='multiline-static'
          label='Full Description'
          multiline
          rows='3'
          defaultValue='Type Full Description Here About 2 paragraphs if applicable'
          className={classes.textField}
          margin='normal'
        />
        <TextField
          required
          id='company-name'
          label='Company Name'
          defaultValue='Type Company Name'
          type='text'
          className={classes.textField}
          margin='normal'
        />
        <TextField
          require
          id='date'
          label='Start Date'
          type='date'
          defaultValue='2017-05-24'
          className={classes.textField}
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          require
          id='time'
          label='Start Time'
          type='time'
          defaultValue='07:30'
          className={classes.textField}
          InputLabelProps={{
            shrink: true
          }}
          inputProps={{
            step: 300 // 5 min
          }}
        />
        <TextField
          require
          id='date'
          label='End Date'
          type='date'
          defaultValue='2017-05-24'
          className={classes.textField}
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          required
          id='time'
          label='End Time'
          type='time'
          defaultValue='07:30'
          className={classes.textField}
          InputLabelProps={{
            shrink: true
          }}
          inputProps={{
            step: 300 // 5 min
          }}
        />
        <TextField
          required
          id='redeem-code'
          label='Set Redeem Code'
          defaultValue='redeem code of this coupon'
          className={classes.textField}
          margin='normal'
        />
        <TextField
          required
          id='logo-img'
          label='Type Logo Img URL Link '
          defaultValue='https://imgur.com/gallery/eGNwxp3'
          className={classes.textField}
          margin='normal'
        />
        <TextField
          required
          id='primary-img'
          label='Type Coupon Img URL Link '
          defaultValue='https://imgur.com/gallery/eGNwxp3'
          className={classes.textField}
          margin='normal'
        />
        <TextField
          required
          id='password-input'
          label='Password'
          className={classes.textField}
          defaultValue='Type PassWord'
          type='password'
          autoComplete='current-password'
          margin='normal'
        />
        <Button className={classes.button} variant='raised' color='default'>
        Submit
        </Button>
      </form>
    </Paper>
  </div>
)

Assessment.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Assessment)
