const ipn = require('paypal-ipn');

function receiveIPNData(req, res) {
  res.sendStatus(200);
  console.log(req.body);
  ipn.verify(req.body, {allow_sandbox: true}, (err, message) => {
    if(err) {
      console.log(err);
      return;
    }
    console.log(message);
  })
}

module.exports = receiveIPNData;
