const firebaseConfig = {
  apiKey: "AIzaSyDHf4IYjKikmX0L9xV0MTIQJYZzPhiKglE",
  authDomain: "testera-club.firebaseapp.com",
  projectId: "testera-club",
  storageBucket: "testera-club.appspot.com",
  messagingSenderId: "217551276739",
  appId: "1:217551276739:web:18b8ced74db5a28388b076",
  measurementId: "G-7T580T3NM4"
};


     // Initialize Firebase
     //const app = initializeApp(firebaseConfig);
     //const analytics = getAnalytics(app);

     firebase.initializeApp(firebaseConfig);
     const analytics = firebase.analytics();