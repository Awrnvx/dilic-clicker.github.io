// firebase-config.js
const firebaseConfig = {
    apiKey: "AIzaSyBHcptZefbC53BR6wMPEtyIF9GCx2y7xjw",
    authDomain: "dilic-clicker.firebaseapp.com",
    databaseURL: "https://dilic-clicker-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "dilic-clicker",
    storageBucket: "dilic-clicker.firebasestorage.app",
    messagingSenderId: "651188156647",
    appId: "1:651188156647:web:7ef858931f7fb4526b8a42"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const CREATOR_ID = "-OoEwrjU2Mehwmv3qQcC";
window.CREATOR_ID = CREATOR_ID;