import React from 'react';
import setLanguage from '../languages';
import T from 'i18n-react';

class News extends React.Component {
  render() {
    setLanguage(this.props.params.lang || 'da');
    return (
      <div>
        <h1 className="headline"><T.text text="news.headline" /></h1>
        <p><T.text text="news.text" /></p>
        
      </div>
    )
  }
}

News.propTypes = {
  params: React.PropTypes.shape({
    lang: React.PropTypes.string
  })
};

export default News;
