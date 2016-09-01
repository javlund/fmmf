import React from 'react';
import setLanguage from '../languages';
import T from 'i18n-react';

class Contact extends React.Component {
  render () {
    setLanguage(this.props.params.lang);
    return (
      <div>
        <h1 className="headline"><T.text text="contact.headline" /></h1>
        <p><a href="mailto:jtroelsgaard@gmail.com">E-mail</a></p>
        <p><a href="http://metal-magic.dk/" target="_blank">Metal Magic festival website</a></p>
        <p><a href="https://www.facebook.com/MetalMagicFestival/" target="_blank">Metal Magic festival Facebook</a></p>
      </div>
    )
  }
}

Contact.propTypes = {
  params: React.PropTypes.shape({
    lang: React.PropTypes.string
  })
};


export default Contact;
