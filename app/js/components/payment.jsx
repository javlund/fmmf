import React from 'react';
import setLanguage from '../languages';
import T from 'i18n-react';

const Payment = props => {
  const {id, lang} = props.params;
  const description = T.translate('payment.description');
  const amount = `${T.translate('payment.amount')}.00`;
  const currency = T.translate('payment.currency');
  const returnUrl = `http://fmmf.dk/thanks/${id}`;
  setLanguage(lang);
  return (
    <div>
      <h1 className="headline"><T.text text="payment.headline" /></h1>
      <p><T.text text="payment.text" /></p>
      <div>
        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
          <input type="hidden" name="cmd" value="_xclick-subscriptions" />
          <input type="hidden" name="business" value="friendsofmetalmagic@gmail.com" />
          <input type="hidden" name="item_name" value={description} />
          <input type="hidden" name="lc" value="BM" />
          <input type="hidden" name="no_note" value="1" />
          <input type="hidden" name="src" value="1" />
          <input type="hidden" name="a3" value={amount} />
          <input type="hidden" name="p3" value="1" />
          <input type="hidden" name="t3" value="Y" />
          <input type="hidden" name="currency_code" value={currency} />
          <input type="hidden" name="return" value={returnUrl} />
          <input type="hidden" name="bn" value="PP-SubscriptionsBF:btn_subscribeCC_LG.gif:NonHostedGuest" />
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
