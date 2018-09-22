import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import ThumbsUp from '@material-ui/icons/ThumbUp'
import ReplyIcon from '@material-ui/icons/ModeComment'

import Button from '@material-ui/core/Button'

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
      <Paper style={{width:'85%', marginLeft:'15%'}} className={classes.root} elevation={2}>
        <Typography variant='headline' component='h3'>
        Tyler Gottlieb
        </Typography>
        <Typography component='p'>
        REPLYYYYYYYYYYYYYYEPYYY will be great extra sqaggy sidjhsdhskfjsdkfhsdkjfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjklfjsdk
        </Typography>
        <Button color='primary'><ThumbsUp />Like</Button>
          <Button color='primary'><ReplyIcon />Reply</Button>
      </Paper>
    </div>
  )
}

Comment.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Comment)
