const ipn = require('paypal-ipn');
const database = require('./database');

const members = database.members;

function receiveIPNData(req, res) {
  const body = req.body;
  res.sendStatus(200);
  ipn.verify(body, {allow_sandbox: true}, (err, message) => {
    if(err) {
      console.log(err);
      return;
    }
    console.log(message);
    console.log(body);
    if(body.payment_status === 'Completed') {
      const id = body.custom;
      const now =  new Date().getTime();
      console.log(`Payment for member ${id} was completed.`);
      members.child('id').update({lastpaid: now}, err => {
        if(err) {
          console.log(`Could not update member ${id} with lastpaid set to ${now}, error is: ` + err);
          return;
        }
      });

    }
  })
}


module.exports = receiveIPNData;
