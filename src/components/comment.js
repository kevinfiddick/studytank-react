import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import ThumbsUp from '@material-ui-icons/ThumbsUpAlt'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
})

function Comment (props) {
  const { classes, comment } = props

  return (
    <div>
      <Paper className={classes.root} elevation={15}>
        <Typography variant='headline' component='h3'>
        Tyler Gottlieb
        </Typography>
        <Typography component='p'>
        This is the comment Body all the shazzy that they put here will be great extra sqaggy sidjhsdhskfjsdkfhsdkjfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjklfjsdk
        </Typography>
        <ThumbsUp />
      </Paper>
    </div>
  )
}

Comment.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Comment)
