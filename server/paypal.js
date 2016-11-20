const ipn = require('paypal-ipn');
const log = require('./log');
const database = require('./database');
const mail = require('./mail');

const members = database.members;

function receiveIPNData(req, res) {
  const body = req.body;
  res.sendStatus(200);
  ipn.verify(body, {allow_sandbox: true}, (err, message) => {
    if(err) {
      log.warn(err);
      return;
    }
    log.info(message);
    log.info(body);
    if(body.payment_status === 'Completed') {
      const id = body.custom;
      const now =  new Date().getTime();
      log.info(`Payment for member ${id} was completed.`);
      members.child(id).update({lastpaid: now}, err => {
        if(err) {
          log.warn(`Could not update member ${id} with lastpaid set to ${now}, error is: ` + err);
          return;
        }
        members.child(id).once(snapshot => {
          const member = snapshot.val();
          mail.sendMembershipConfirmationMail(member);
        });
      });
    } else {
      log.warn('Membership status was NOT completed.');
    }
  })
}


module.exports = receiveIPNData;
