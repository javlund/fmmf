import React from 'react';
import setLanguage from '../languages';
import T from 'i18n-react';

const Payment = props => {
  const {id, lang} = props.params;
  setLanguage(lang);
  const buttonId = T.translate('payment.buttonId');
  return (
    <div>
      <h1 className="headline"><T.text text="payment.headline" /></h1>
      <p><T.text text="payment.text" /></p>
      <div>
        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
          <input type="hidden" name="cmd" value="_s-xclick" />
          <input type="hidden" name="member_id" value={id} />
          <input type="hidden" name="lang" value={lang} />
          <input type="hidden" name="hosted_button_id" value={buttonId} />
          <button className="btn btn-default btn-sm"><T.text text="payment.paypal" /></button>
        </form>
      </div>
    </div>
  );
};

Payment.propTypes = {
  params: React.PropTypes.shape({
    id: React.PropTypes.string,
    lang: React.PropTypes.string
  })
};

export default Payment;
