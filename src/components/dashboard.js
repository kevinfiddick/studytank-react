import React from 'react'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const styles = {
  root: {
    padding: 10,
    maxWidth: 900,
    margin: '10px auto'
  }
}

const DashboardPage = ({classes}) => (
  <div>
    <Paper className={classes.root}>
      <Typography component='p'>
        MISSION STATEMENT: SnapSmalls goal is to provide local businesses with
        an affordable way to create unique digital coupon offers which target
        new clientele as well as help to build awareness of local business
        brands within the Milwaukee community.
      </Typography>

      <Typography component='p'>
        SnapSmall is a local deals (virtual coupon book) site where you can
        browse offers for free (without registering), redeem offers & earn
        points for our monthly giveaway contests. There is no charge for you to
        use SnapSmall but you must register on our site/ app in order to redeem
        deals and earn points.
      </Typography>

      <Typography component='p'>
        Each deal has a unique password used to unlock the deal at checkout.
        Once you find a deal you like, all you have to do is visit the business,
        open the SnapSmall website or app and show the deal to the associate.
        They will provide you with a unique "password" which will unlock that
        specific deal. That's it! You get the deal and we'll keep track of your
        points. Redeem as many offers in person as you would like.
      </Typography>

      <Typography component='p'>
        We are constantly working to add new business partners so make sure to
        check back often and share our service with others who also like to shop
        for local deals!
      </Typography>

    </Paper>
  </div>
)

export default withStyles(styles)(DashboardPage)
