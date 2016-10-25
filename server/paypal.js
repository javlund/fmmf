const ipn = require('paypal-ipn');

function receiveIPNData(req, res) {
  const body = req.body;
  console.log(req.headers);
  console.log(body);
  res.sendStatus(200);
  ipn.verify(body, {allow_sandbox: true}, (err, message) => {
    if(err) {
      console.log(err);
      return;
    }
    console.log(message);
  })
}

module.exports = receiveIPNData;
