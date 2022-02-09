import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyACc2FGAT8Je-Cg9O_Gkn5LPS6OwpuU1e8",
    authDomain: "instagram-clone-react-718b6.firebaseapp.com",
    projectId: "instagram-clone-react-718b6",
    storageBucket: "instagram-clone-react-718b6.appspot.com",
    messagingSenderId: "457874096339",
    appId: "1:457874096339:web:7086be1981cdc2602bd426",
    measurementId: "G-DB1Q6N7NXT"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db, auth, storage}
