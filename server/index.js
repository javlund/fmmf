const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const Promise = require('bluebird');
const jwt = require('json-web-token');
const helmet = require('helmet');
const log = require('./log');
const database = require('./database');
const Facebook = require('./facebook');
const paypal = require('./paypal');
const mail = require('./mail');

const app = express();

const jwtSecret = process.env.JWT_SECRET;
const port = process.env.PORT || 2500;
const paypalDebug = process.env.PAYPAL_SANDBOX === 'true';
const environment = process.env.NODE_ENVIRONMENT;

const acceptedEmails = ['jacob@avlund.dk', 'jtroelsgaard@gmail.com'];
const baseUrl = environment === 'heroku' ? 'http://www.fmmf.dk' : 'http://localhost:' + port; 
const facebook = new Facebook(acceptedEmails, jwtSecret, baseUrl);
const members = database.members;

function generateId() {
  return Math.ceil((Math.random() * 9000000) + 1000000);
}

function getCountry(danishName) {
  const countries = require('../app/js/data/countries');
  const foundCountry = countries.find(country => country.daName === danishName);
  return {
    value: foundCountry.code,
    label: danishName
  };
}

app.use(function(err, req, res, next) {
  log.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use(helmet());
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
    if(!result) {
      res.status(200).json([]);
      return;
    }
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
  /*const body = req.body;
  const dataAsArray = body.map(entry => {
    const id = generateId();
    delete entry.ID;
    return Object.assign({}, entry, {
      id,
      country: getCountry(entry.country.trim())
    });
  });
  const dataAsObject = dataAsArray.reduce((obj, current) => {
    obj[current.id] = current;
    return obj;
  }, {});
  members.set(dataAsObject, () => {
    res.status(200).json({status: dataAsArray.length + ' members written.'});
  });*/
  res.status(200).json({status: 'This endpoint is currently unavailable.'});
});

app.post('/private/members/sendmail', (req, res) => {
  members.once('value', snapshot => {
    const allMembers = snapshot.val();
    const promises = Object.keys(allMembers)
      .filter(key => {
        return !allMembers[key].mailSent
      })
      .map(key => {
        const member = allMembers[key];
        return mail.sendExistingMembersMail(member).reflect();
      });
    let errors;
    Promise
      .all(promises)
      .each(inspection => {
        if(inspection.isFulfilled()) {
          const value = inspection.value();
          const member = value.member;
          members.child(member.id).update({mailSent: true});
        } else {
          errors++;
        }
      })
      .then(() => {
        if(errors) {
          log.warn(errors + ' errors encountered when sending out mails.');
          res.status(500).json({members: promises.length, errors: errors});
          return;
        }
        res.status(200).json({status: 'ok', members: promises.length});
      })
  });
});

app.post('/member', bodyParser.json(), (req, res) => {
  const body = req.body;
  const id = generateId();
  const member = Object.assign({}, body, {
    id,
    created: new Date().getTime(),
    mailSent: true,
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
      log.warn(err.response);
      res.status(500).json({status: 'Error: ' + err.message});
    });
});

app.get('/facebook', facebook.getFacebook());

app.get('/facebook-callback', facebook.getFacebookCallback.bind(facebook));

app.post('/receive-ipn', bodyParser.urlencoded({extended: false}), paypal);

app.get('/paypal-config', (req, res) => {
  const daButton = paypalDebug ? '5BUDQQA48JGJL' : 'YH98X2QRH9X4C';
  const enButton = paypalDebug ? '2NVBCW62SNJ48' : '86TE3AZW2HGB2';
  const daDonateButton = 'CZKWKFEHWPWPA';
  const enDonateButton = 'QC24D5UNWMMKL';
  
  const paypalData = {
    debug: paypalDebug,
    baseUrl,
    daButton,
    enButton,
    daDonateButton,
    enDonateButton
  };
  res.status(200).send(paypalData);
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'index.html'));
});
  
app.listen(port, () => {
  log.info('Listening on port ' + port);
});
