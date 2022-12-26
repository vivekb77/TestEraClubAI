var userId;
var user_Email;
var creditsLeft;
var creditsToSend;
var emailToSendCredits;
var userIdOfUserToSendCredits;

analytics.logEvent('TestEra Account page visited', { name: '' });

document.getElementById('sendCredits').disabled = true;

checkLogin();
function checkLogin() {
    firebase.auth().onAuthStateChanged((user) => {

        if (!user) {
           
            location.replace('/Login');

        }
        if (user) {
            var userisAorNot = user.isAnonymous.toString();

            if (userisAorNot === "true") {
                location.replace('/Login');
            }
            if (userisAorNot === "false") {
               
                userId = user.uid;
                user_Email=user.email
                getRemainingCredits()
            }


        }
    })
}



function getRemainingCredits() {

    // set this to send it for payment
    document.getElementById('customer_email_ToStripe1').value=user_Email;
    document.getElementById('customer_email_ToStripe2').value=user_Email;
    document.getElementById('customer_email_ToStripe3').value=user_Email;
    document.getElementById('loggedinemail').innerText = user_Email;

    const database = firebase.database();

    database.ref('/myCredits').orderByChild("userId").equalTo(userId)
        .once("value", function (ALLRecords) {
            ALLRecords.forEach(
                function (CurrentRecord) {

                    creditsLeft = CurrentRecord.val().creditsRemaining;

                    if(creditsLeft <= 5){

                        document.getElementById('creditsLeft').style.color="red";
                    }
                    document.getElementById('creditsLeft').innerText = creditsLeft + " Credits Remaining";
                    console.log(creditsLeft);
                    document.getElementById('sendCredits').disabled = false;
                    
                });


        });


}



function getEmailToSendCredits(){

    document.getElementById('sendCredits').disabled = true;
    getRemainingCredits(); // update the credits remainig first

    document.getElementById('success').innerText = "";
    creditsToSend = document.getElementById('creditsToSend').value.trim();

    if (creditsToSend == null || creditsToSend == "") {
        document.getElementById('validation').innerText = "Enter Credits to send";
        return false;
    } 
    if (creditsToSend.length > 2) {
        document.getElementById('validation').innerText = "Max 99 credits can be sent";
        return false;
    }
    if(!/^[0-9]+$/.test(creditsToSend))
    {
        document.getElementById('validation').innerText = "Only numbers are allowed";
        return false;
    }


    emailToSendCredits = document.getElementById('emailToSendCredits').value.trim();
   
     if (emailToSendCredits == null || emailToSendCredits == "") {
         document.getElementById('validation').innerText = "Enter Email to send credits";
         return false;
     } if (emailToSendCredits.length > 50) {
         document.getElementById('validation').innerText = "Email Too long, 50 chars max";
         return false;
     }

     if(user_Email == emailToSendCredits){
        document.getElementById('validation').innerText = "You can't send credits to yourself"
        return false;
    }
     var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
     if(emailToSendCredits.match(mailformat)){
        getUser(emailToSendCredits);
        return true; 
        
     }
     else{
            document.getElementById('validation').innerText = "Enter a valid email";
            return false;
     }
     

}

function getUser(emailToSendCredits){

    
    userIdOfUserToSendCredits= null;

    const database = firebase.database();

    database.ref('/myCredits').orderByChild("user_Email").equalTo(emailToSendCredits)
        .once("value", function (ALLRecords) {
            ALLRecords.forEach(
                function (CurrentRecord) {

                    userIdOfUserToSendCredits = CurrentRecord.val().userId;

                });

                if (userIdOfUserToSendCredits == null) {

                    document.getElementById('validation').innerText = "The User with this Email is not a user of TestEra. Please ask them to sign in first and try again.";
        
                }
                if (userIdOfUserToSendCredits != null) {

                    sendCredits();
                   
                }
        });

    
       
}

function sendCredits(){
    
    document.getElementById('validation').innerText = "";

    if(user_Email == emailToSendCredits){
        document.getElementById('validation').innerText = "You can't send credits to yourself"
        return false;
    }

    if(creditsLeft < creditsToSend){
        document.getElementById('validation').innerText = "You don't have enough credits to send"
        return false;
    }
    if(creditsToSend < 1){
        document.getElementById('validation').innerText = "Can't send 0 credits"
        return false;
    }
    if(creditsLeft <= 10){
        document.getElementById('validation').innerText = "You need more than 10 credits in your account to send"
        return false;
    }
    if(creditsLeft > creditsToSend && creditsLeft > 10){
        debitACredit();
        creditACredit();
        getRemainingCredits();

    }
    
}

function debitACredit() {

    var userRef = firebase.database().ref(`myCredits/${userId}`);
    userRef.update({
        creditsRemaining: firebase.database.ServerValue.increment(-(parseInt(creditsToSend)))
    });

    creditMessage = creditsToSend +" sent to " +emailToSendCredits ;
    debitACreditLog(creditMessage);
}

function debitACreditLog(creditMessage) {

    const database = firebase.database();
    const usersRef = database.ref('/myCreditsKaLog');
    const autoId = usersRef.push().key;

    usersRef.child(autoId).set({

        userId: userId,
        creditsDebited: creditsToSend,
        creditsCredited: 0,
        creditMessage: creditMessage,
        createdDate: firebase.database.ServerValue.TIMESTAMP,

    })
}


function creditACredit() {

    var userRef = firebase.database().ref(`myCredits/${userIdOfUserToSendCredits}`);
    userRef.update({
        creditsRemaining: firebase.database.ServerValue.increment(parseInt(creditsToSend)),

    });
    creditMessage = creditsToSend +" sent by " +user_Email ;

    creditACreditLog(creditMessage);
}

function creditACreditLog(creditMessage) {

    const database = firebase.database();
    const usersRef = database.ref('/myCreditsKaLog');
    const autoId = usersRef.push().key;

    usersRef.child(autoId).set({

        userId: userIdOfUserToSendCredits,
        creditsDebited: 0,
        creditsCredited: creditsToSend,
        creditMessage: creditMessage,
        createdDate: firebase.database.ServerValue.TIMESTAMP,

    })
    document.getElementById('success').innerText = creditsToSend+ " Credits were sent successfully to " + emailToSendCredits;
    document.getElementById('emailToSendCredits').value = "";
    document.getElementById('creditsToSend').value = "";
}




var urlParams = new URLSearchParams(window.location.search);
var sessionId = urlParams.get('session_id');

if (sessionId) {
  fetch('/checkout-session?sessionId=' + sessionId)
    .then(function (result) {
      return result.json();
    })
    .then(function (session) {
        if(session.payment_status == "paid" && session.status == "complete"){
            document.getElementById('paymentStatusLabel').innerText ="Payment was successful, Credits are added to your account. If Credits are not added, refresh the page in a few seconds or contact us using the Contact us link.";
        }
        else{
            document.getElementById('paymentStatusLabel').innerText ="Something went wrong with the payment. If your payment was successful and credits are not added to your account, please contact us.";
            
        }
     

    })
    .catch(function (err) {
      console.log('Error when fetching Checkout session', err);
    });
}

function goHome(){
    location.replace('/');
}