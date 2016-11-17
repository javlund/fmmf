import React from 'react';
import T from 'i18n-react';
import 'whatwg-fetch';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import {browserHistory} from 'react-router';
import moment from 'moment';
import setLanguage from '../languages';
import countries from '../data/countries.json';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-select/dist/react-select.css';

const endDate = moment();

function getCountryOptions(lang) {
  const selector = `${lang}Name`;
  return countries.map(country => {
    const intName = country[selector];
    const nativeName = country.nativeName;
    const label = intName === nativeName ? intName : `${intName} (${nativeName})`;
    const value = country.code;
    return {
      label,
      value
    };
  });
}

function validateField(key, value) {
  if(key === 'zip' && /[^\d]/.test(value)) {
    return false;
  }
  return true;
}

function validateEmail(value) {
  return /([\w\.]+)@([\w\.]+)\.(\w+)/g.test(value);
}

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        name: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        birthdate: moment(),
        country: 'DK'
      }
    };
    this.changeValue = this.changeValue.bind(this);
    this.changeCountry = this.changeCountry.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.validate = this.validate.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
  }

  render() {
    const {lang} = this.props;
    const {fields} = this.state;
    setLanguage(lang);
    const countryOptions = getCountryOptions(lang);
    const selectPlaceholderText = lang === 'en' ? 'Select...' : 'Vælg...';
    const errorField = this.state.error ? <div className="alert alert-danger">{this.state.error}</div> : <div />;
    const messageField = this.state.message ? <div className="alert alert-success">{this.state.message}</div> : <div />;
    return <form id="signupform" onSubmit={this.submit.bind(this)}>
      <div className="row form-horizontal">
        {errorField}
        {messageField}
        <div className="col-md-8">
          <div className="form-group">
            <label htmlFor="name" className="col-md-3 control-label"><T.text text="signup.name" /></label>
            <div className="col-md-9">
              <input id="name" name="name" ref="name" className="form-control" value={fields.name} onChange={this.changeValue('name')} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email" className="col-md-3 control-label"><T.text text="signup.email" /></label>
            <div className="col-md-9">
              <input id="email" name="email" ref="email" className="form-control" value={fields.email} onChange={this.changeValue('email')} onBlur={this.checkEmail.bind(undefined, false)} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="address" className="col-md-3 control-label"><T.text text="signup.address" /></label>
            <div className="col-md-9">
              <input id="address" name="address" ref="address" className="form-control" value={fields.address} onChange={this.changeValue('address')} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="city" className="col-md-3 control-label"><T.text text="signup.city" /></label>
            <div className="col-md-9">
              <input id="city" name="city" ref="city" className="form-control" value={fields.city} onChange={this.changeValue('city')} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="zip" className="col-md-3 control-label"><T.text text="signup.zip" /></label>
            <div className="col-md-9">
              <input id="zip" name="zip" ref="zip" className="form-control" value={fields.zip} onChange={this.changeValue('zip')} maxLength="5" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="country" className="col-md-3 control-label"><T.text text="signup.country" /></label>
            <div className="col-md-9">
              <Select id="country" name="country" options={countryOptions} value={fields.country} onChange={this.changeCountry} ref="country" menuContainerStyle={{zIndex: 500}} placeholder={selectPlaceholderText} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="birthdate" className="col-md-3 control-label"><T.text text="signup.birthdate" /></label>
            <div className="col-md-9">
              <DatePicker selected={fields.birthdate} onChange={this.changeDate} maxDate={endDate} dateFormat="DD/MM/YYYY" ref="birthdate" className="form-control" />
            </div>
          </div>
          <div className="form-group">
            <div className="col-md-3"></div>
            <div className="col-md-9">
              <button id="signup" className="btn btn-default" disabled={this.validate()}><T.text text="signup.button" /></button>
            </div>
          </div>
        </div>
      </div>
    </form>
  }

  changeValue(key) {
    return (event) => {
      const value = event.target.value;
      if(validateField(key, value)) {
        const fields = this.state.fields;
        this.setState({
          fields: {...fields, [key]: event.target.value}
        });        
      }
      if(key === 'email') {
        this.checkEmail(true);
      }
    }
  }

  getValueFromRef(ref) {
    const input = this.refs[ref];
    return input.value;
  }

  clearForm() {
    const keys = Object.keys(this.refs);
    keys.forEach(ref => {
      this.refs[ref].value = '';
    });
  }

  changeDate(birthdate) {
    this.setState({
      fields: {...this.state.fields, birthdate}
    });
  }

  changeCountry(country) {
    this.setState({
      fields: {...this.state.fields, country}
    });
  }

  checkEmail(isBlur) {
    const {email} = this.state.fields;
    const validated = validateEmail(email);
    if(validated) {
      this.setState({
        error: ''
      });
      return;
    }
    if(!isBlur) {
      this.setState({
        error: T.translate('signup.emailError')
      });
    }

  }

  validate() {
    const {fields} = this.state;
    const problems = Object.keys(fields).filter(key => fields[key] === '');
    return problems.length;
  }

  submit(event) {
    event.preventDefault();
    const {fields} = this.state;
    const {lang} = this.props;
    fetch('/member', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fields)
    }).then(response => {
      if(!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then(json => {
      const id = json.id;
      browserHistory.push(`/payment/${id}/${lang}`);
    }).catch(() => {
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
