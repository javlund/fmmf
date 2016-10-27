const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const database = require('./database');
const Facebook = require('./facebook');
const paypal = require('./paypal');
const jwt = require('json-web-token');
const mail = require('./mail');
const app = express();
const jwtSecret = process.env.JWT_SECRET;
const port = process.env.PORT || 2500;

const acceptedEmails = ['jacob@avlund.dk', 'jtroelsgaard@gmail.com'];
const facebook = new Facebook(acceptedEmails, jwtSecret);
const members = database.members;

function generateId() {
  return Math.ceil((Math.random() * 9000000) + 1000000);
}

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use(express.static('.'));
app.use(facebook.getMiddleware());
app.use('/private/*', (req, res, next) => {
  const token = req.query.token;
  if(!token) {
    res.status(401).json({message: 'Resource forbidden'});
    return;
  }
  jwt.decode(jwtSecret, token, (err, decodedToken) => {
    if(err) {
      res.status(401).json(err);
      return;
    }
    const email = decodedToken.email;
    if(acceptedEmails.indexOf(email) === -1) {
      res.status(401).json({message: 'E-mail not accepted'});
      return;
    }
    next();
  })
});

app.get('/private/members', (req, res) => {
  members.once('value', snapshot => {
    const result = snapshot.val();
    const resultAsArray = Object.keys(result).map(key => result[key]);
    const filteredResult = resultAsArray.filter(entry => entry.deleted === 0);
    res.status(200).json(filteredResult);
  });
});

app.post('/private/members/:id/approve', (req, res) => {
  const id = req.params.id;
  const approvedDate = new Date().getTime();
  members.child(id).update({approved: approvedDate}, err => {
    if(err) {
      res.status(500).json(err);
      return;
    }
    res.status(200).json({approvedate: approvedDate});
  });
});

app.post('/private/members/:id/pay', (req, res) => {
  const id = req.params.id;
  const date = req.query.date;
  members.child(id).update({lastpaid: date}, err => {
    if(err) {
      res.status(500).json(err);
      return;
    }
    res.status(200).json({paiddate: date});
  });
});

app.post('/private/members', bodyParser.json(), (req, res) => {
  const body = req.body;
  const dataAsArray = body.map(entry => {
    const id = generateId();
    delete entry.ID;
    return Object.assign({}, entry, {
      id
    });
  });
  const dataAsObject = dataAsArray.reduce((obj, current) => {
    obj[current.id] = current;
    return obj;
  }, {});
  members.set(dataAsObject, () => {
    res.status(200).json({status: dataAsArray.length + ' members written.'});
  });
});

app.post('/member', bodyParser.json(), (req, res) => {
  const body = req.body;
  const id = generateId();
  const member = Object.assign({}, body, {
    id,
    created: new Date().getTime(),
    lastpaid: 0,
    modified: 0,
    deleted: 0
  });
  members
    .child(id)
    .set(member)
    .then(() => {
      return mail.sendNewMemberMail(member);
    }).then(() => {
      res.status(200).json({status: 'member created', id: id});
    }).catch(err => {
      console.log(err.message);
      res.status(500).json({status: 'Error: ' + err.message});
    });
});

app.get('/facebook', facebook.getFacebook());


app.get('/facebook-callback', facebook.getFacebookCallback.bind(facebook));

app.post('/receive-ipn', bodyParser.urlencoded({extended: false}), paypal);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'index.html'));
});
  
app.listen(port, () => {
  console.log('Listening on port ' + port);
});
