const ipn = require('paypal-ipn');

function receiveIPNData(req, res) {
  res.send(200);
  ipn.verify(req.body, (err, message) => {
    if(err) {
      console.log(err);
      return;
    }
    console.log(req.body);
    console.log(message);
  })
}

module.exports = receiveIPNData;
