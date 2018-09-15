import React, { Component } from 'react';
import Script from 'react-load-script'
import Button from '@material-ui/core/Button';
import ax from './api';


/**
 * this.props requires:
 *    apiUsername,
 * this.props optional:
 *
**/
export default class Payroc extends Component {

  state = {
    buttonVariant: 'contained',
    buttonColor: 'primary',
    buttonClassName: '',
    card: {
      name: '',
      number: '',
      cvv: '',
      exp_month: '',
      exp_year: '',
      address: {
        line1: '',
        city: '',
        state: '',
        postal_code: ''
      }
    }


  };

    onTransactionSubmit(e){
      e.preventDefault();

      ax({
          method: 'post',
          url: 'https://api.itransact.com/transactions/',
          headers: {
		          'Authorization': this.props.apiUsername,
		          'ContentType': 'application/json'
          },
          data: {
              amount: this.props.amount,
              card: this.state.card
          }
        }).then(res => {

        });
    }

    componentDidMount() {

      //overwrite default button settings if button settings are specified
      this.props.buttonVariant && this.setState({ buttonVariant: this.props.buttonVariant });
      this.props.buttonColor && this.setState({ buttonColor: this.props.buttonColor });
      this.props.buttonClassName && this.setState({ buttonClassName: this.props.buttonClassName });

    }

    render() {
        return (
          <div>
              <form onClick={this.onTransactionSubmit.bind(this)}>
                <Button type='submit' variant={this.state.buttonVariant} color={this.state.buttonColor} className={this.state.buttonClassName}>
                  Submit
                </Button>
              </form>
          </div>
        );
    }
}
