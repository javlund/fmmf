import React from 'react';
import T from 'i18n-react';
import setLanguage from '../languages';

const Paid = props => {
  const {lang, id} = props.params;
  setLanguage(lang);

  return (
    <div>
      <h1 className="headline"><T.text text="paid.headline" /></h1>
      <p><T.text text="paid.text" /></p>

    </div>
  );
};

Paid.propTypes = {
  params: React.PropTypes.shape({
    lang: React.PropTypes.string
  }),
  query: React.PropTypes.shape({
    member_id: React.PropTypes.string
  })
};

export default Paid;
