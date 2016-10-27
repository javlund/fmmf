import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyCeV3Q_RSp3jHyskS2VjqilQrZ6EmzTw_8",
  authDomain: "fmmf-d2d95.firebaseapp.com",
  databaseURL: "https://fmmf-d2d95.firebaseio.com",
  storageBucket: "fmmf-d2d95.appspot.com",
  messagingSenderId: "425715350694"
};
firebase.initializeApp(config);
const db = firebase.database();

export default db;