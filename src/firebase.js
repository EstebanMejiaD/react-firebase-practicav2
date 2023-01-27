import firebase from 'firebase/app'
import 'firebase/firestore'
const firebaseConfig = {
    apiKey: "AIzaSyDcEYUbFPlx0vObp0VN5h5QRQL0oQmp5SM",
    authDomain: "react-firebase-practicav2.firebaseapp.com",
    projectId: "react-firebase-practicav2",
    storageBucket: "react-firebase-practicav2.appspot.com",
    messagingSenderId: "46895030075",
    appId: "1:46895030075:web:3deca66e240e6a1653e11e",
    measurementId: "G-L4TVMH3QD0"
  };
  
  // Initialize Firebase
 firebase.initializeApp(firebaseConfig);
 export {firebase}
 