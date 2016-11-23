const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const jwt = require('json-web-token');
const log = require('./log');

class Facebook {
  constructor(acceptedEmails, jwtSecret, baseUrl) {
    passport.use(new FacebookStrategy({
        clientID: '611519625696646',
        clientSecret: '53f2e11ea0f516c10758de1b7257dc15',
        callbackURL: `${baseUrl}/facebook-callback`,
        profileFields: ['id', 'displayName', 'email']
      },
      (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        if(acceptedEmails.indexOf(email) === -1) {
          done(null, false, {message: 'User is not permitted.'});
          return;
        }
        done(null, profile);
      }
    ));

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });

    this.jwtSecret = jwtSecret;
  }

  getMiddleware() {
    return passport.initialize();
  }

  getFacebook() {
    return passport.authenticate('facebook', {scope: ['email']});
  }

  getFacebookCallback(req, res, next) {
    const jwtSecret = this.jwtSecret;
    passport.authenticate(
      'facebook',
      (err, user) => {
        if(err) {
          log.warn(err);
          res.redirect('/error');
          return;
        }
        const payload = {
          id: user.id,
          email: user.emails[0].value
        };
        jwt.encode(jwtSecret, payload, (jwtErr, token) => {
          if(jwtErr) {
            log.warn(jwtErr);
            res.end();
            return;
          }
          res.redirect('/facebook.html?' + token);
        });
      }
    )(req, res, next);
  }
}

module.exports = Facebook;
