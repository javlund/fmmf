const firebase = require('firebase');

firebase.initializeApp({
  serviceAccount: "firebase.json",
  databaseURL: "https://fmmf-d2d95.firebaseio.com"
});

const db = firebase.database();

const members = db.ref('members');

module.exports = {
    members: members
};