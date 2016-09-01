import React from 'react';
import setLanguage from '../languages';
import T from 'i18n-react';
import $ from 'jquery';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

let endDate = moment();

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment()
    };
  }

  render() {
    setLanguage(this.props.lang);
    let errorField = this.state.error ? <div className="alert alert-danger">{this.state.error}</div> : <div />;
    let messageField = this.state.message ? <div className="alert alert-success">{this.state.message}</div> : <div />;
    return <form id="signupform" onSubmit={this.submit.bind(this)}>
      <div className="row form-horizontal">
        {errorField}
        {messageField}
        <div className="col-md-8">
          <div className="form-group">
            <label htmlFor="name" className="col-md-3 control-label"><T.text text="signup.name" /></label>
            <div className="col-md-9">
              <input id="name" name="name" ref="name" className="form-control" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email" className="col-md-3 control-label"><T.text text="signup.email" /></label>
            <div className="col-md-9">
              <input id="email" name="email" ref="email" className="form-control" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="address" className="col-md-3 control-label"><T.text text="signup.address" /></label>
            <div className="col-md-9">
              <input id="address" name="address" ref="address" className="form-control" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="city" className="col-md-3 control-label"><T.text text="signup.city" /></label>
            <div className="col-md-9">
              <input id="city" name="city" ref="city" className="form-control" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="zip" className="col-md-3 control-label"><T.text text="signup.zip" /></label>
            <div className="col-md-9">
              <input id="zip" name="zip" ref="zip" className="form-control" maxLength="5" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="country" className="col-md-3 control-label"><T.text text="signup.country" /></label>
            <div className="col-md-9">
              <input id="country" name="country" ref="country" className="form-control" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="birthdate" className="col-md-3 control-label"><T.text text="signup.birthdate" /></label>
            <div className="col-md-9">
              <DatePicker selected={this.state.startDate} onChange={this.changeDate.bind(this)} maxDate={endDate} dateFormat="DD/MM/YYYY" ref="birthdate" className="form-control" />
            </div>
          </div>
          <div className="form-group">
            <div className="col-md-3"></div>
            <div className="col-md-9">
              <button id="signup" className="btn btn-default"><T.text text="signup.button" /></button>
            </div>
          </div>
        </div>
      </div>
    </form>
  }

  getValueFromRef(ref) {
    let input = this.refs[ref];
    return input.value;
  }

  clearForm() {
    let keys = Object.keys(this.refs);
    keys.forEach(ref => {
      this.refs[ref].value = '';
    });
  }

  changeDate(date) {
    this.setState({
      startDate: date
    });
  }

  submit(event) {
    event.preventDefault();
    let data = {
      name: this.getValueFromRef('name'),
      email: this.getValueFromRef('email'),
      address: this.getValueFromRef('address'),
      city: this.getValueFromRef('city'),
      zip: this.getValueFromRef('zip'),
      country: this.getValueFromRef('country'),
      birthdate: this.state.startDate.valueOf(),
      joindate: new Date().getTime()
    };
    $.ajax({
      url: 'php/members/create',
      data: data,
      method: 'POST'
    }).done(() => {
      this.clearForm();
      this.setState({
        error: undefined,
        message: T.translate('signup.success')
      })
    }).fail(() => {
      this.setState({
        error: T.translate('signup.error'),
        message: undefined
      });
    })
  }
}

Signup.propTypes = {
  lang: React.PropTypes.string
};

export default Signup;
