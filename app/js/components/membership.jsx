import React from 'react';
import Signup from './signup';
import setLanguage from '../languages';
import T from 'i18n-react';

class Membership extends React.Component {
  render () {
    setLanguage(this.props.params.lang);
    return (
      <div>
        <h1 className="headline"><T.text text="membership.headline" /></h1>
        <p><T.text text="membership.text" /></p>
        <Signup lang={this.props.params.lang} />
      </div>
    )
  }
}

Membership.propTypes = {
  params: React.PropTypes.shape({
    lang: React.PropTypes.string
  })
};

export default Membership;
