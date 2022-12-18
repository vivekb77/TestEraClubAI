

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

temp 0 write 30 test cases for ecommerce buy journey
1. Test that the user can successfully add an item to their cart.
2. Test that the user can successfully remove an item from their cart.
3. Test that the user can successfully update the quantity of an item in their cart.
4. Test that the user can successfully view their cart.
5. Test that the user can successfully view the total cost of their cart.
6. Test that the user can successfully view the shipping cost of their cart.
7. Test that the user can successfully view the tax cost of their cart.
8. Test that the user can successfully view the total cost of their cart including shipping and taxes.
9. Test that the user can successfully select a payment method.
10. Test that the user can successfully enter their payment information.
11. Test that the user can successfully enter their shipping address.
12. Test that the user can successfully enter their billing address.
13. Test that the user can successfully enter their contact information.
14. Test that the user can successfully view the order summary.
15. Test that the user can successfully view the estimated delivery date.
16. Test that the user can successfully view the estimated arrival date.
17. Test that the user can successfully view the estimated shipping cost.
18. Test that the user can successfully view the estimated tax cost.
19. Test that the user can successfully view the estimated total cost.
20. Test that the user can successfully view the estimated delivery time.
21. Test that the user can successfully view the estimated arrival time.
22. Test that the user can successfully view the estimated shipping time.
23. Test that the user can successfully view the estimated tax time.
24. Test that the user can successfully view the estimated total time.
25. Test that the user can successfully view the order confirmation page.
26. Test that the user can successfully view the order confirmation email.
27. Test that the user can successfully view the order tracking page.
28. Test that the user can successfully view the order tracking email.
29. Test that the user can successfully view the order status page.
30. Test that the user can successfully view the order status email.

temp 1 write 30 test cases for ecommerce buy journey
1. Test that the user can select an item from the homepage and add it to their cart.
2. Test that the user can navigate to the checkout page and enter their payment details.
3. Test that the user can select a payment method and complete the purchase.
4. Test that the user can view their order history.
5. Test that the user can view their order details.
6. Test that the user can update their shipping address.
7. Test that the user can update their payment information.
8. Test that the user can add a coupon code to their order.
9. Test that the user can view their order status.
10. Test that the user can view their order tracking information.
11. Test that the user can view their order total.
12. Test that the user can view their order delivery date.
13. Test that the user can view their order delivery method.
14. Test that the user can select a delivery option.
15. Test that the user can view their order items.
16. Test that the user can view their order subtotal.
17. Test that the user can view their order tax.
18. Test that the user can view their order shipping cost.
19. Test that the user can view their order total cost.
20. Test that the user can view their order discounts.
21. Test that the user can view their order summary.
22. Test that the user can view their order confirmation page.
23. Test that the user can view their order confirmation email.
24. Test that the user can view their order receipt.
25. Test that the user can view their order invoice.
26. Test that the user can cancel their order.
27. Test that the user can return their order.
28. Test that the user can contact customer service.
29. Test that the user can review their order.
30. Test that the user can save their payment information for future purchases.

temp 1 write 30 test cases for ecommerce coupon referral
1. Verify that a user can enter a valid coupon code when making a purchase.
2. Verify that a user can successfully apply a coupon code to their purchase.
3. Verify that a user can refer a friend to the ecommerce site and receive a coupon code.
4. Verify that a user can enter a referral code when making a purchase.
5. Verify that a user can successfully apply a referral code to their purchase.
6. Verify that a user can enter a valid coupon code and a valid referral code when making a purchase.
7. Verify that a user can successfully apply both a coupon code and a referral code to their purchase.
8. Verify that a user can only use a coupon code once.
9. Verify that a user can only use a referral code once.
10. Verify that a user cannot use a coupon code and a referral code at the same time.
11. Verify that a user cannot use an expired coupon code.
12. Verify that a user cannot use an expired referral code.
13. Verify that a user cannot use a coupon code that has already been used.
14. Verify that a user cannot use a referral code that has already been used.
15. Verify that a user can only use a coupon code that is valid for the items they are purchasing.
16. Verify that a user can only use a referral code that is valid for the items they are purchasing.
17. Verify that a user can only use a coupon code that is valid for the amount they are purchasing.
18. Verify that a user can only use a referral code that is valid for the amount they are purchasing.
19. Verify that a user can only use a coupon code that is valid for the store they are purchasing from.
20. Verify that a user can only use a referral code that is valid for the store they are purchasing from.
21. Verify that a user can only use a coupon code that is valid for the country they are purchasing from.
22. Verify that a user can only use a referral code that is valid for the country they are purchasing from.
23. Verify that a user can only use a coupon code that is valid for the payment method they are using.
24. Verify that a user can only use a referral code that is valid for the payment method they are using.
25. Verify that a user can only use a coupon code that is valid for the shipping method they are using.
26. Verify that a user can only use a referral code that is valid for the shipping method they are using.
27. Verify that a user can only use a coupon code that is valid for the delivery date they are requesting.
28. Verify that a user can only use a referral code that is valid for the delivery date they are requesting.
29. Verify that a user can only use a coupon code that is valid for the quantity they are purchasing.
30. Verify that a user can only use a referral code that is valid for the quantity they are purchasing.

temp 0 write 30 test cases for ecommerce coupon referral
1. Verify that a user can successfully refer a coupon to another user.
2. Verify that a user can successfully redeem a coupon referred by another user.
3. Verify that a user can successfully refer a coupon to multiple users.
4. Verify that a user can successfully refer a coupon to a user who is not registered on the ecommerce platform.
5. Verify that a user can successfully refer a coupon to a user who is registered on the ecommerce platform.
6. Verify that a user can successfully refer a coupon to a user who is not in the same country.
7. Verify that a user can successfully refer a coupon to a user who is in the same country.
8. Verify that a user can successfully refer a coupon to a user who is not in the same city.
9. Verify that a user can successfully refer a coupon to a user who is in the same city.
10. Verify that a user can successfully refer a coupon to a user who is not in the same state.
11. Verify that a user can successfully refer a coupon to a user who is in the same state.
12. Verify that a user can successfully refer a coupon to a user who is not in the same zip code.
13. Verify that a user can successfully refer a coupon to a user who is in the same zip code.
14. Verify that a user can successfully refer a coupon to a user who is not in the same area code.
15. Verify that a user can successfully refer a coupon to a user who is in the same area code.
16. Verify that a user can successfully refer a coupon to a user who is not in the same time zone.
17. Verify that a user can successfully refer a coupon to a user who is in the same time zone.
18. Verify that a user can successfully refer a coupon to a user who is not in the same country code.
19. Verify that a user can successfully refer a coupon to a user who is in the same country code.
20. Verify that a user can successfully refer a coupon to a user who is not in the same currency.
21. Verify that a user can successfully refer a coupon to a user who is in the same currency.
22. Verify that a user can successfully refer a coupon to a user who is not in the same language.
23. Verify that a user can successfully refer a coupon to a user who is in the same language.
24. Verify that a user can successfully refer a coupon to a user who is not in the same continent.
25. Verify that a user can successfully refer a coupon to a user who is in the same continent.
26. Verify that a user can successfully refer a coupon to a user who is not in the same region.
27. Verify that a user can successfully refer a coupon to a user who is in the same region.
28. Verify that a user can successfully refer a coupon to a user who is not in the same time zone.
29. Verify that a user can successfully refer a coupon to a user who is in the same time zone.
30. Verify that a user can successfully refer a coupon to a user who is not in the same country.

temp 1 Eg. API testing for login page
1. Test valid user credential
2. Test account locked after multiple wrong attempts
3. Test a different password after changing the user password
4. Test no data entry in the login page
5. Test invalid login credentials
6. Test session expiring after a certain time
7. Test page redirecting to the main page after logging out
8. Test page redirecting safety after logout
9. Test remember me feature
10. Test login page with multiple valid accounts
11. Test login page with two accounts at same time
12. Test login with different password and username combinations
13. Test user with valid email and invalid username
14. Test login screen with special characters
15. Test valid username and no password
16. Test username with maximum character length
17. Test valid password with minimum character length
18. Test valid password with maximum character length
19. Test page error due to server overload
20. Test page error due to invalid host name
21. Test page error due to invalid protocol
22. Test page error due to unsupported browsers
23. Test page error due to unsupported operating system
24. Test page error when URL is typed wrong
25. Test page error with corrupted cookies
26. Test page when low internet speed
27. Test buffering of static fields
28. Test case to maximize the window
29. Test case to minimize the window
30. Test when valid username is correct but password is wrong

temp 0 API testing for login page
1. Verify that the login page is accessible with valid URL
2. Verify that the login page is not accessible with invalid URL
3. Verify that the login page is accessible with valid credentials
4. Verify that the login page is not accessible with invalid credentials
5. Verify that the login page is not accessible without credentials
6. Verify that the login page is not accessible with empty credentials
7. Verify that the login page is not accessible with special characters in credentials
8. Verify that the login page is not accessible with alphanumeric characters in credentials
9. Verify that the login page is not accessible with blank spaces in credentials
10. Verify that the login page is not accessible with extra characters in credentials
11. Verify that the login page is not accessible with wrong case of credentials
12. Verify that the login page is not accessible with wrong order of credentials
13. Verify that the login page is not accessible with wrong combination of credentials
14. Verify that the login page is not accessible with wrong data type of credentials
15. Verify that the login page is not accessible with wrong format of credentials
16. Verify that the login page is not accessible with wrong length of credentials
17. Verify that the login page is not accessible with wrong encoding of credentials
18. Verify that the login page is not accessible with wrong encoding of characters in credentials
19. Verify that the login page is not accessible with wrong encoding of special characters in credentials
20. Verify that the login page is not accessible with wrong encoding of alphanumeric characters in credentials
21. Verify that the login page is not accessible with wrong encoding of blank spaces in credentials
22. Verify that the login page is not accessible with wrong encoding of extra characters in credentials
23. Verify that the login page is not accessible with wrong encoding of wrong case of credentials
24. Verify that the login page is not accessible with wrong encoding of wrong order of credentials
25. Verify that the login page is not accessible with wrong encoding of wrong combination of credentials
26. Verify that the login page is not accessible with wrong encoding of wrong data type of credentials
27. Verify that the login page is not accessible with wrong encoding of wrong format of credentials
28. Verify that the login page is not accessible with wrong encoding of wrong length of credentials
29. Verify that the login page is not accessible with wrong encoding of wrong encoding of characters in credentials
30. Verify that the login page is not accessible with wrong encoding of wrong encoding of special characters in credentials


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
function dollarToCredits(){
    dollarAmountPaid = 5.13;
    creditsToOffer1 = dollarAmountPaid*20;
    creditsToOffer = Math.round(creditsToOffer1);
    console.log(creditsToOffer);
    creditACredit(creditsToOffer);
}

var creditsToOffer;
function creditACredit(creditsToOffer){

    var userRef= firebase.database().ref(`myCredits/${userId}`);
    userRef.update({
        creditsRemaining: firebase.database.ServerValue.increment(creditsToOffer)
    });

    getRemainingCredits();
    creditACreditLog(creditsToOffer);
}

function creditACreditLog(creditsToOffer){

    const database = firebase.database();
    const usersRef = database.ref('/creditLog');
    const autoId = usersRef.push().key;

    usersRef.child(autoId).set({
    
     userId:userId,
     creditsDebited: 0,
     creditsCredited: creditsToOffer,
     createdDate: firebase.database.ServerValue.TIMESTAMP,
     
    })
}
