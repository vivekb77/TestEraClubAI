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


// code for pop up
// function closeTreactPopup(){ 
//     document.querySelector(".treact-popup").classList.add("hidden");
//   }
//   function openTreactPopup(){ 
//     document.querySelector(".treact-popup").classList.remove("hidden");
//   }
//   document.querySelector(".close-treact-popup").addEventListener("click", closeTreactPopup);
//   setTimeout(openTreactPopup, 3000)

{/* <div class="REMOVE-THIS-ELEMENT-IF-YOU-ARE-USING-THIS-PAGE hidden treact-popup fixed inset-0 flex items-center justify-center" style="background-color: rgba(0,0,0,0.3);">
<div class="max-w-lg p-8 sm:pb-4 bg-white rounded shadow-lg text-center sm:text-left">
  
  <h3 class="text-xl sm:text-2xl font-semibold mb-6 flex flex-col sm:flex-row items-center">
    <div class="bg-green-200 p-2 rounded-full flex items-center mb-4 sm:mb-0 sm:mr-2">
      <svg class="text-green-800 inline-block w-5 h-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
      </div>
    Payment was successful and Credits are addded to your account.
  </h3>  
  <p>If credits are not added, please email us at <span class="font-bold">support@testera.club</span></p>
  <p class="mt-2">We usually reply within an hour.</p>
  <div class="mt-8 pt-8 sm:pt-4 border-t -mx-8 px-8 flex flex-col sm:flex-row justify-end leading-relaxed">
    <button class="close-treact-popup px-8 py-3 sm:py-2 rounded border border-gray-400 hover:bg-gray-200 transition duration-300">Close</button>
    <a class="font-bold mt-4 sm:mt-0 sm:ml-4 px-8 py-3 sm:py-2 rounded bg-purple-700 text-gray-100 hover:bg-purple-900 transition duration-300 text-center" href="/templates/Account" target="_blank">Go to account</a>
  </div>
</div>
</div> */}
 