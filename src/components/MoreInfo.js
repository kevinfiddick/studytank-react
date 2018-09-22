import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const styles = theme => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  inlets: {
    textAlign: 'left',
    margin: 'auto'
  }
})

function SimpleExpansionPanel (props) {
  const { classes, note } = props
  return (
    <div className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Tap for more details about {note.title}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <ul>
            <li>
              <Typography className={classes.inlets}>
              Author: {note.authorFirstname + ' ' + note.authorLastname}
              </Typography>
            </li>
            <li>
              <Typography className={classes.inlets}>
            Subject: {note.subject}
              </Typography>
            </li>
            <li>
              <Typography className={classes.inlets}>
              Date Created: {note.date}
              </Typography>
            </li>
            <li>
              <Typography className={classes.inlets}>
              School: {note.school}
              </Typography>
            </li>
            <li>
              <Typography className={classes.inlets}>
              Subject: {note.subject}
              </Typography>
            </li>
            <li>
              <Typography className={classes.inlets}>
              Is Fact: {note.isFact}
              </Typography>
            </li>
            <li>
              <Typography className={classes.inlets}>
              Textbook: {note.textbook}
              </Typography>
            </li>
          </ul>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  )
}

SimpleExpansionPanel.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SimpleExpansionPanel)
