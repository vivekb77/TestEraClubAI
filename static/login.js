// Confirm the link is a sign-in with email link.
if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
   
    var email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
    //   email = window.prompt('Please provide your email for confirmation');
    document.getElementById('validation').innerText = "Please open the link on the same device / browser where it was requested."

    }
    // The client SDK will parse the code from the link for you.
    firebase.auth().signInWithEmailLink(email, window.location.href)
      .then((result) => {
        // Clear email from storage.
        window.localStorage.removeItem('emailForSignIn');
      })
      .catch((error) => {
        document.getElementById('validation').innerText = "Error occured while signing with Email link."
      });
  }



checkLogin();
function checkLogin() {
    firebase.auth().onAuthStateChanged((user) => {

        
        if (!user) {

        //    console.log("user not logged in")
        //   location.replace('/Login');

        }
        if (user) {
            var userisAorNot = user.isAnonymous.toString();

            if (userisAorNot === "true") {
              
                // console.log("user not logged in")
                // location.replace('/Login');
            }
            if (userisAorNot === "false") {
              
                // console.log("user logged in")
                document.getElementById('validation1').innerText = "Login successful"
                location.replace('/');

            }


        }
    })
}


function signInWithGoogle() {

    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);

    firebase.auth()
        .getRedirectResult()
        .then((result) => {
            if (result.credential) {
                /** @type {firebase.auth.OAuthCredential} */
                analytics.logEvent('Login successful', { name: '' });
                location.replace('/');

            }

            analytics.logEvent('Google Login attempted', { name: '' });


        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;

            var errorMessage = error.message;
            document.getElementById('validation').innerText = errorMessage;

            // The email of the user's account used.
            var email = error.email;
            document.getElementById('validation').innerText = email;

            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            document.getElementById('validation').innerText = credential;

            // ...
        });

}



function signInWithEmailLink() {

    var user_email = document.getElementById('User_email').value.trim();

    var actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be in the authorized domains list in the Firebase Console.
        url: 'http://127.0.0.1:5000/Login',
        // This must be true.
        handleCodeInApp: true,
      };

    firebase.auth().sendSignInLinkToEmail(user_email, actionCodeSettings)
    .then(() => {
    // The link was successfully sent. Inform the user.
    window.localStorage.setItem('emailForSignIn', user_email);
    document.getElementById('validation').innerText = "";
    document.getElementById('validation1').innerText = "A sign in link is sent to "+user_email +" Please click/use the link on the same device / browser to sign in.";
   
    })
    .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    document.getElementById('validation').innerText = errorMessage;

    // ...
    });

    analytics.logEvent('Sign In with link attempted', { name: '' });

}


// Confirm the link is a sign-in with email link.
if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
    // Additional state parameters can also be passed via URL.
    // This can be used to continue the user's intended action before triggering
    // the sign-in operation.
    // Get the email if available. This should be available if the user completes
    // the flow on the same device where they started it.
    var email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      email = window.prompt('Please provide your email for confirmation');
    }
    // The client SDK will parse the code from the link for you.
    firebase.auth().signInWithEmailLink(email, window.location.href)
      .then((result) => {
        // Clear email from storage.
        window.localStorage.removeItem('emailForSignIn');
        // You can access the new user via result.user
        // Additional user info profile not available via:
        // result.additionalUserInfo.profile == null
        // You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser
      })
      .catch((error) => {
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
      });
  }