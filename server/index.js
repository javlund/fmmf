const path = require('path');
const firebase = require('firebase');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const jwt = require('json-web-token');
const mail = require('./mail');
const app = express();
const jwtSecret = process.env.JWT_SECRET;
const port = process.env.PORT || 2500;

const acceptedEmails = ['jacob@avlund.dk'];

firebase.initializeApp({
  serviceAccount: "firebase.json",
  databaseURL: "https://fmmf-d2d95.firebaseio.com"
});

const db = firebase.database();

passport.use(new FacebookStrategy({
    clientID: '611519625696646',
    clientSecret: '53f2e11ea0f516c10758de1b7257dc15',
    callbackURL: 'http://localhost:2500/facebook-callback',
    profileFields: ['id', 'displayName', 'email']
  },
  (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    if(acceptedEmails.indexOf(email) === -1) {
      done(null, false, {message: 'User is not permitted.'});
      return;
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const members = db.ref('members');

app.use(express.static('.'));
app.use(bodyParser.json());
app.use(passport.initialize());
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

function generateId() {
  return Math.ceil((Math.random() * 9000000) + 1000000);
}

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

app.post('/private/members', (req, res) => {
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

app.post('/member', (req, res) => {
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
      res.status(200).json({status: 'member created with id ' + id});
    }).catch(err => {
      console.log(err.message);
      res.status(500).json({status: 'Error: ' + err.message});
    });
});

app.get('/facebook', passport.authenticate('facebook', {scope: ['email']}));

app.get('/facebook-callback', (req, res, next) => {
  passport.authenticate(
    'facebook',
    (err, user, info) => {
      if(err) {
        res.redirect('/error');
        return;
      }
      const payload = {
        id: user.id,
        email: user.emails[0].value
      };
      jwt.encode(jwtSecret, payload, (jwtErr, token) => {
        if(jwtErr) {
          console.log(jwtErr);
          res.end();
          return;
        }
        res.redirect('/facebook.html?' + token);
      });
    }
  )(req, res, next);
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'index.html'));
});
  
app.listen(port, () => {
  console.log('Listening on port ' + port);
});
