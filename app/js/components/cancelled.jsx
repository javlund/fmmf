import React from 'react';
import {browserHistory} from 'react-router';
import T from 'i18n-react';
import setLanguage from '../languages';

function backToPayment(id, lang) {
  browserHistory.push(`/payment/${id}/${lang}`);
}

const Cancelled = props => {
  const {id, lang} = props.params;
  setLanguage(lang);

  return (
    <div>
      <h1 className="headline"><T.text text="cancelled.headline" /></h1>
      <p><T.text text="cancelled.text" /></p>
      <button className="btn btn-default btn-sm" onClick={() => backToPayment(id, lang)}><T.text text="cancelled.tryagain" /></button>
    </div>
  );
};

Cancelled.propTypes = {
  params: React.PropTypes.shape({
    lang: React.PropTypes.string
  }),
  query: React.PropTypes.shape({
    member_id: React.PropTypes.string
  })
};

export default Cancelled;
