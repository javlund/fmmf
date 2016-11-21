import React from 'react';
import {connect} from 'react-redux';
import T from 'i18n-react';
import setLanguage from '../languages';
import {loadPaypalConfig} from '../actions/paypal';

import loadingIndicator from '../../images/ajax-loader.gif';

class Payment extends React.Component {
  componentDidMount() {
    this.props.loadPaypalConfig();
  }

  render() {
    const {id, lang} = this.props.params;
    const {loading, baseUrl, debug, daButton, enButton} = this.props;
    if(loading) {
      return (
        <div>
          <img src={loadingIndicator} />
        </div>
      );
    }
    setLanguage(lang);
    const buttonId = lang === 'da' ? daButton : enButton;
    const returnUrl = `${baseUrl}/paid/${id}/${lang}`;
    const cancelUrl = `${baseUrl}/cancelled/${id}/${lang}`;
    const paypalBaseUrl = debug ? 'https://www.sandbox.paypal.com' : 'https://www.paypal.com';
    return (
      <div>
        <h1 className="headline"><T.text text="payment.headline" /></h1>
        <p><T.text text="payment.text" /></p>
        <div>
          <form action={`${paypalBaseUrl}/cgi-bin/webscr`} method="post" target="_top">
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="return" value={returnUrl}/>
            <input type="hidden" name="cancel_return" value={cancelUrl}/>
            <input type="hidden" name="custom" value={id} />
            <input type="hidden" name="hosted_button_id" value={buttonId} />
            <button className="btn btn-default btn-sm"><T.text text="payment.paypal" /></button>
          </form>
        </div>
      </div>
    );
  }
}

Payment.propTypes = {
  params: React.PropTypes.shape({
    id: React.PropTypes.string,
    lang: React.PropTypes.string
  }),
  loadPaypalConfig: React.PropTypes.func,
  loading: React.PropTypes.bool,
  debug: React.PropTypes.bool,
  baseUrl: React.PropTypes.string,
  daButton: React.PropTypes.string,
  enButton: React.PropTypes.string
};

const mapStateToProps = state => {
  return state.paypal;
}

const mapDispatchToProps = {
  loadPaypalConfig
};

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
