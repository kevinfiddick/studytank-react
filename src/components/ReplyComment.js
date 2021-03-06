import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import ThumbsUp from '@material-ui/icons/ThumbUp'
import ReplyIcon from '@material-ui/icons/ModeComment'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

class Comment extends Component {
  state = {
    liked: false,
    name: '',
    color: 'default',
    badge: ''
  }

  componentWillMount(){
    var liked = this.props.liked;
    if(liked) this.setState({ liked: liked });
    var name = this.props.name;
    if(name) this.setState({ name: name });
    var color = this.props.color;
    if(color) this.setState({ color: color });
  }

  return (
    <div>
    <Grid container spacing={24}>
    <Grid item xs={10}>
      <Paper elevation={2}>
        <Typography variant='headline' component='h3'>
          {this.state.name}{this.props.badge && <Chip label={this.state.badge} color={this.state.color} />}
        </Typography>
        <Typography component='p'>
          {this.props.children}
        </Typography>
          <Button color={this.state.liked ? 'primary' : 'default'}><ThumbsUp />{this.state.liked ? 'Liked' : 'Like'}</Button>
          <Button color='default'><ReplyIcon />Reply</Button>
      </Paper>
    </Grid>
    </Grid>
    </div>
  )
}

export default Comment;
