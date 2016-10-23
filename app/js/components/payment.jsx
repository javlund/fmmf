import React from 'react';
import setLanguage from '../languages';
import T from 'i18n-react';

const SANDBOX = true;

const Payment = props => {
  const {id, lang} = props.params;
  setLanguage(lang);
  const buttonId = T.translate(SANDBOX ? 'payment.sandboxButtonId' : 'payment.buttonId');
  const returnUrl = `http://localhost:2500/paid/${id}/${lang}`;
  const cancelUrl = `http://localhost:2500/cancelled/${id}/${lang}`;
  return (
    <div>
      <h1 className="headline"><T.text text="payment.headline" /></h1>
      <p><T.text text="payment.text" /></p>
      <div>
        <form action="https://www.sandbox.paypal.com/cgi-bin/webscr" method="post" target="_top">
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
};

Payment.propTypes = {
  params: React.PropTypes.shape({
    id: React.PropTypes.string,
    lang: React.PropTypes.string
  })
};

export default Payment;
