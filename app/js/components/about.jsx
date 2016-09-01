import React from 'react';
import setLanguage from '../languages';
import T from 'i18n-react';

class About extends React.Component {
  render() {
    setLanguage(this.props.params.lang);
    return (
      <div>
        <h1 className="headline"><T.text text="about.headline" /></h1>
        <p><T.text text="about.text" /></p>
      </div>
    )
  }
}

About.propTypes = {
  params: React.PropTypes.shape({
    lang: React.PropTypes.string
  })
};

export default About;
