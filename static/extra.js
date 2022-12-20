// tips to get better results

// Ask your requirements multiple times with different wording and then put everything together.
// Try different values for Complexity and see which one gives you the best results. Try 9 for more creative outputs, and 0 for well-defined outputs.


//add placeholder to db
    addPlaceholderDataToDB();
        
    function addPlaceholderDataToDB(){



        const database = firebase.database();
        const usersRef = database.ref('/PlaceholderText');
        const autoId = usersRef.push().key
        
        usersRef.child(autoId).set({
        
        placeholderText: "Eg. Summary of book Spaiens",
         createdDate: firebase.database.ServerValue.TIMESTAMP,
         
        })
       
        firebasePrimaryId = autoId;
       
        
    }

    // #monitor the response for flagged = true and do not show output
    // # {
    // #   "id": "modr-XXXXX",
    // #   "model": "text-moderation-001",
    // #   "results": [
    // #     {
    // #       "categories": {
    // #         "hate": false,
    // #         "hate/threatening": false,
    // #         "self-harm": false,
    // #         "sexual": false,
    // #         "sexual/minors": false,
    // #         "violence": false,
    // #         "violence/graphic": false
    // #       },
    // #       "category_scores": {
    // #         "hate": 0.18805529177188873,
    // #         "hate/threatening": 0.0001250059431185946,
    // #         "self-harm": 0.0003706029092427343,
    // #         "sexual": 0.0008735615410842001,
    // #         "sexual/minors": 0.0007470346172340214,
    // #         "violence": 0.0041268812492489815,
    // #         "violence/graphic": 0.00023186142789199948
    // #       },
    // #       "flagged": false
    // #     }
    // #   ]
    // # }
    
//will be obselete
// var totalTokensUsedByUserToday;
// function getTotalTokensUsedToday(){


// totalTokensUsedByUserToday = 0;

// const database = firebase.database();

// database.ref('/tokensUsedByUserDetailed').orderByChild("userId").equalTo(userId) 
//    .once("value",function(ALLRecords){
//        ALLRecords.forEach(
//            function(CurrentRecord) {

//    var totalTokensUsedByUserToday1 = CurrentRecord.val().totaltokensused;
//    var createdDate1 = CurrentRecord.val().createdDate;

//     var createdDate = new Date(createdDate1).toLocaleDateString(); 
//     var todaysDate = new Date().toLocaleDateString();   

//    //add all tokens used by user in the same day 
//     if(createdDate === todaysDate){

//         totalTokensUsedByUserToday = totalTokensUsedByUserToday+totalTokensUsedByUserToday1;
//     }

//    });     


//    });


// }



//dollarToCredits();
// function dollarToCredits(){
//     dollarAmountPaid = 5.13;
//     creditsToOffer1 = dollarAmountPaid*20;
//     creditsToOffer = Math.round(creditsToOffer1);
//     console.log(creditsToOffer);
//     creditACredit(creditsToOffer);
// }

var creditsToOffer=100;
var stripePaymentId
var userPaymentEmail
var payment_status;
var amount_total;
var client_reference_id;
var currencyOfPayment;

function creditACredit(creditsToOffer){

    var userRef= firebase.database().ref(`myCredits/${userId}`);
    userRef.update({
        creditsRemaining: firebase.database.ServerValue.increment(creditsToOffer)
    });

    creditACreditLog(creditsToOffer);
}

function creditACreditLog(creditsToOffer){

    const database = firebase.database();
    const usersRef = database.ref('/creditLog');
    const autoId = usersRef.push().key;

    usersRef.child(autoId).set({
    
     userId:userId,
     creditsDebited: 0,
     stripePaymentId:stripePaymentId,
     creditsCredited: creditsToOffer,
     createdDate: firebase.database.ServerValue.TIMESTAMP,
     
    })
}

function paymentsLog(){

    const database = firebase.database();
    const usersRef = database.ref('/PaymentsLog');
    const autoId = usersRef.push().key;

    usersRef.child(autoId).set({
    
     userId:userId,
     stripePaymentId:stripePaymentId,
     amountPaid:amountPaid ,
     creditsCredited: creditsCredited,
     createdDate: firebase.database.ServerValue.TIMESTAMP,
     
    })
}
