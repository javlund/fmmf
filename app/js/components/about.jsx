import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import T from 'i18n-react';
import setLanguage from '../languages';
import {loadPaypalConfig} from '../actions/paypal';

import loadingIndicator from '../../images/ajax-loader.gif';
import statutes from '../../docs/vedtaegter-2015.docx';
import minutes from '../../docs/2015.10.21-GF.doc';

class About extends React.Component {
  componentDidMount() {
    this.props.loadPaypalConfig();
  }
  
  render() {
    const {lang, thanks} = this.props.params;
    const {loading, baseUrl, daDonateButton, enDonateButton} = this.props;
    if(loading) {
      return (
        <div>
          <img src={loadingIndicator} />
        </div>
      );
    }
    setLanguage(lang);
    const paypalBaseUrl = 'https://www.paypal.com';
    const buttonId = lang === 'da' ? daDonateButton : enDonateButton;
    const returnUrl = `${baseUrl}/about/thanks/${lang}`;
    const cancelUrl = `${baseUrl}/about/${lang}`;
    return (
      <div>
        <h1 className="headline"><T.text text="about.headline" /></h1>
        <p><T.text text="about.text" /></p>
        <p><T.text text="about.documents" /></p>
        <ul>
          <li><a href={statutes} target="_blank"><T.text text="about.statutes" /></a></li>
          <li><a href={minutes} target="_blank"><T.text text="about.minutes" /></a></li>
        </ul>
        {thanks ?
          <b><T.text text="about.thanks" /></b>
        : 
          <form action={`${paypalBaseUrl}/cgi-bin/webscr`} method="post" target="_top">
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="return" value={returnUrl}/>
            <input type="hidden" name="cancel_return" value={cancelUrl}/>
            <input type="hidden" name="hosted_button_id" value={buttonId} />
            <p><T.text text="about.donate" /></p>
            <p><button className="btn btn-default btn-sm"><T.text text="about.donateButton" /></button></p>
            <p><Link to={`membership/${lang}`}><T.text text="about.membership" /></Link></p>
          </form>          
        }
      </div>
    )
  }
}

About.propTypes = {
  params: React.PropTypes.shape({
    lang: React.PropTypes.string,
    thanks: React.PropTypes.string
  }),
  loadPaypalConfig: React.PropTypes.func,
  loading: React.PropTypes.bool,
  baseUrl: React.PropTypes.string,
  daDonateButton: React.PropTypes.string,
  enDonateButton: React.PropTypes.string
};

const mapStateToProps = state => {
  return state.paypal;
}

const mapDispatchToProps = {
  loadPaypalConfig
};


export default connect(mapStateToProps, mapDispatchToProps)(About);
