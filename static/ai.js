var elem = document.querySelector('input[type="range"]');

var rangeValue = function () {
    var newValue = elem.value;
    var target = document.querySelector('.value');
    target.innerHTML = newValue;
}

elem.addEventListener("input", rangeValue);



//login start
var userId = null;

//to do on page load start
analytics.logEvent('TestEra Virtual Assistant page visited', { name: '' });
//disable the copy button till output is written

//disable now, enable them when credits are fetched
document.getElementById('submitRequirements_TestCases').disabled = true;
document.getElementById('submitRequirements_UserStories').disabled = true;
 //enable the copy button
 document.getElementById("copyButton").disabled = true;
 document.getElementById("shareButton").disabled = true;



checkLogin();
function checkLogin() {
    firebase.auth().onAuthStateChanged((user) => {

        if (!user) {
            //if user is not logged in
            document.getElementById("LogInButton").style.visibility = "visible";
            document.getElementById("loggedinemail").style.visibility = "hidden";
            document.getElementById("logoutButton").style.visibility = "hidden";
            console.log("not user1");
            document.getElementById('submitRequirements_TestCases').disabled = false;
            document.getElementById('submitRequirements_UserStories').disabled = false;


        }
        if (user) {
            var userisAorNot = user.isAnonymous.toString();

            if (userisAorNot === "true") {
                // if user isAnonymous and not logged in 
                document.getElementById("LogInButton").style.visibility = "visible";
                document.getElementById("loggedinemail").style.visibility = "hidden";
                document.getElementById("logoutButton").style.visibility = "hidden";
                console.log("not user2");
                document.getElementById('submitRequirements_TestCases').disabled = false;
                document.getElementById('submitRequirements_UserStories').disabled = false;


            }
            if (userisAorNot === "false") {
                //if user is logged in
                document.getElementById("LogInButton").style.visibility = "hidden";
                document.getElementById("loggedinemail").style.visibility = "visible";
                document.getElementById("logoutButton").style.visibility = "visible";

                document.getElementById("loggedinemail").innerText = "Logged in as " + user.email.slice(0, 25);  // email display first 15 chars
                // console.log("user");
                userId = user.uid;
                isUserNew();

            }


        }
    })
}



function logIn() {

    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);

    firebase.auth()
        .getRedirectResult()
        .then((result) => {
            if (result.credential) {
                /** @type {firebase.auth.OAuthCredential} */
                analytics.logEvent('Login successful', { name: '' });


            }

            analytics.logEvent('Login attempted', { name: '' });


        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;

            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });

}



function logOut() {

    firebase.auth().signOut()
    userId = null // have to do or user id logic on page works as if user was logged even when logged out

    document.getElementById("LogInButton").style.visibility = "visible";
    document.getElementById("loggedinemail").style.visibility = "hidden";
    document.getElementById("logoutButton").style.visibility = "hidden";

}

// login end

var requirements
var TestorStoriesType
var complexity;
var creditsRemaining = 0;

//called on test cases button click
function gatherTestCasesDataToSend() {


    //only logged in users can query
    if (userId == null) {
        document.getElementById('validation').innerText = "Login with Google (takes just ~10 secs) to Generate Test Cases";
        analytics.logEvent('TestEra tried asking without login', { name: '' });
    }

    //only logged in users can query
    if (userId !== null) {

        if (creditsRemaining <= 0) {
            document.getElementById('validation').innerText = "It costs a lot of $$ to process this queries. As a free user, you've used all of your 10 free credits. If you want to save time, effort and improve the quality of your test cases, add more credits to your account by clicking 'Add Credits' button below.";
            analytics.logEvent('TestEra user used till limit', { name: '' });
            rpT7Y6a8WRF();
        }

        if (creditsRemaining > 0) {

            //validate if field is not empty. //this is the input sent to AI
            var queryByUser = document.getElementById('user_requirement').value.trim();

            if (queryByUser == null || queryByUser == "") {
                document.getElementById('validation').innerText = "Enter something";
                return false;
            } if (queryByUser.length > 500) {
                document.getElementById('validation').innerText = "Too long, 500 chars max";
                return false;
            }

            document.getElementById("loader").removeAttribute("hidden");
            document.getElementById('shareButton').value = "Share this";
            document.getElementById('copyButton').disabled = true;
            document.getElementById("shareButton").disabled = true;
            document.getElementById("clearBox").disabled = true;
            
            document.getElementById('validation').innerText = "";

            var showProgress = document.getElementById('outputAnswerToDisplay');
            showProgress.innerText = "Thinking...This may take a few seconds. Please Wait...";

            document.getElementById('submitRequirements_UserStories').disabled = true;
            document.getElementById('submitRequirements_TestCases').value = "Thinking...";
            document.getElementById('submitRequirements_TestCases').disabled = true;

            document.getElementById('TestorStoriesType').innerText = "Test Cases"
            document.getElementById('copyButton').value = "Copy Test Cases";

            // for adding to DB
            input = queryByUser.trim();

            

            var complexityelement = document.getElementById("complexityrange");
            var complexity1 = complexityelement.value;
            complexity = complexity1 / 10;
            console.log("complexity= " + complexity);

            TestorStoriesType = "testcases"
            //first moderate query send requirements to python and get the AI generated result

            moderateContent(queryByUser, TestorStoriesType, complexity);

            //log event
            TestCasesButtonClicked();
        }
    }

}

//called on user stories button click
function gatherUserStoriesDataToSend() {

    //only logged in users can query
    if (userId == null) {
        document.getElementById('validation').innerText = "Login with Google (takes just ~10 secs) to Generate User Stories";
        analytics.logEvent('TestEra tried asking without login', { name: '' });
    }

    //only logged in users can query
    if (userId !== null) {

        if (creditsRemaining <= 0) {
            document.getElementById('validation').innerText = "It costs a lot of $$ to process this queries. As a free user, you've used all of your 10 free credits. If you want to save time, effort and improve the quality of your test cases, add more credits to your account by clicking 'Add Credits' button below.";
            analytics.logEvent('TestEra user used till limit', { name: '' });
            rpT7Y6a8WRF();
        }

        if (creditsRemaining > 0) {

            //validate if field is not empty. //this is the input sent to AI
            var queryByUser = document.getElementById('user_requirement').value.trim();

            if (queryByUser == null || queryByUser == "") {
                document.getElementById('validation').innerText = "Enter something";
                return false;
            } if (queryByUser.length > 500) {
                document.getElementById('validation').innerText = "Too long, 500 chars max";
                return false;
            }


            document.getElementById("loader").removeAttribute("hidden");
            document.getElementById('shareButton').value = "Share this";
            document.getElementById('copyButton').disabled = true;
            document.getElementById("shareButton").disabled = true;
            document.getElementById("clearBox").disabled = true;
            document.getElementById('validation').innerText = "";

            var showProgress = document.getElementById('outputAnswerToDisplay');
            showProgress.innerText = "Thinking...This may take a few seconds. Please Wait...";

            document.getElementById('submitRequirements_UserStories').value = "Thinking...";
            document.getElementById('submitRequirements_UserStories').disabled = true;
            document.getElementById('TestorStoriesType').innerText = "User Stories"
            document.getElementById('submitRequirements_TestCases').disabled = true;
            document.getElementById('copyButton').value = "Copy User Stories";

            // for adding to DB
            input = queryByUser.trim();

            var complexityelement = document.getElementById("complexityrange");
            var complexity1 = complexityelement.value;
            complexity = complexity1 / 10;


            TestorStoriesType = "userstories";
            //first moderate query send requirements to python and get the AI generated result
            moderateContent(queryByUser, TestorStoriesType, complexity);

            //log event
            UserStoriesButtonClicked();

        }
    }
}

function TestCasesButtonClicked() {

    analytics.logEvent('Generate Test cases Button clicked', { name: '' });

}

function UserStoriesButtonClicked() {

    analytics.logEvent('Generate User stories Button clicked', { name: '' });

}


//moderate user query and warn of content violates policies
var isQueryContentBad;
function moderateContent(queryByUser, TestorStoriesType, complexity) {

    let querysentToAI = queryByUser.trim();

    const request = new XMLHttpRequest();
    request.open("POST", '/moderateContent?requirement=' + querysentToAI, true);

    request.onload = () => {

        let isQueryContentBad1 = request.responseText//response wiil be true or false , if true contennt violates policies
        // convert data into JSON object

        var parsedData = JSON.parse(isQueryContentBad1);
        isQueryContentBad = parsedData.results[0].flagged.toString();



        // if value is true don't display output and show warning
        if (isQueryContentBad == "true") {
            document.getElementById('validation').innerText = "This Query violates our content policies, no output is displayed.";
            document.getElementById('outputAnswerToDisplay').innerText = "This Query violates our content policies, no output is displayed.";

            document.getElementById('TestorStoriesType').innerText = "Bad request";
            document.getElementById('submitRequirements_TestCases').value = "Test Cases";
            document.getElementById('submitRequirements_TestCases').disabled = false;

            document.getElementById('submitRequirements_UserStories').value = "User Stories";
            document.getElementById('submitRequirements_UserStories').disabled = false;

            beYwbUH4XJ2F6bPYUefH();

        }

        if (isQueryContentBad == "false") {
            if (TestorStoriesType == "testcases") {
                askAI(queryByUser, TestorStoriesType, complexity);

            }
            if (TestorStoriesType == "userstories") {
                askAI(queryByUser, TestorStoriesType, complexity);

            }

        }

    }

    request.send();

}



// get the response generated by AI
var responsefromAI;
function askAI(queryByUser, type, complexity) {

    let querysentToAI = queryByUser;


    //send the info requirement as query string

    const request = new XMLHttpRequest();
    request.open("POST", '/askAI?requirement=' + querysentToAI + "&type=" + type + "&complexity=" + complexity, true);

    request.onload = () => {

        responsefromAI = request.responseText //response from AI 

        displayOutput(responsefromAI);   //display the resonse on UI
    }

    request.send();

}



// display answer on UI
function displayOutput(responsefromAI) {

    document.getElementById('submitRequirements_TestCases').value = "Test Cases";

    document.getElementById('submitRequirements_UserStories').value = "User Stories";

    //set the title of answer based on what the query was

    if (TestorStoriesType == "testcases") {
        document.getElementById('TestorStoriesType').innerText = "Test Cases";
    }
    if (TestorStoriesType == "userstories") {
        document.getElementById('TestorStoriesType').innerText = "User Stories";
    }

    // convert data into JSON object
    var parsedData = JSON.parse(responsefromAI);

    let cleanData = parsedData.choices[0].text.trim();
    let totaltokensused1 = parsedData.usage.total_tokens;
    let querytokensused1 = parsedData.usage.prompt_tokens;
    let answertokensused1 = parsedData.usage.completion_tokens;

    document.getElementById("loader").setAttribute("hidden", "");

    //display the result on the label
    const outputLabel = document.getElementById('outputAnswerToDisplay');
    outputLabel.innerText = "Complexity = " + complexity * 10 + "\n\n" + cleanData.slice(0, 5000);


    //enable the copy button
    document.getElementById("copyButton").disabled = false;
    document.getElementById("shareButton").disabled = false;
    document.getElementById("clearBox").disabled = false;

    // for adding to DB
    output = cleanData;
    totaltokensused = totaltokensused1;
    querytokensused = querytokensused1;
    answertokensused = answertokensused1;

    debitACredit();
    addDataToDB();


}



function clearAll() {

    document.getElementById('submitRequirements_TestCases').value = "Test Cases";
    document.getElementById('submitRequirements_TestCases').disabled = false;

    document.getElementById('submitRequirements_UserStories').value = "User Stories";
    document.getElementById('submitRequirements_UserStories').disabled = false;

    document.getElementById('TestorStoriesType').innerText = "Output";

    var textAreaplaceholeder = ""
    var textAreaplaceholederText1 = document.getElementById('user_requirement');
    textAreaplaceholederText1.value = textAreaplaceholeder;

    document.getElementById('validation').innerText = "";


    var placeholderTextLabel = document.getElementById('outputAnswerToDisplay');
    placeholderTextLabel.innerText = "Your AI generated output will appear here.\n\n TestEra.Club is your virtual testing assistant that can:\n- Generate test cases\n- Generate user stories\n\nAsk your requirements multiple times with different wording and then put everything together."


    document.getElementById('copyButton').value = "Copy Output";
    document.getElementById('copyButton').disabled = true;
    document.getElementById('shareButton').value = "Share this";
    document.getElementById('shareButton').disabled = true;

    //update the title and url and title to just domain
    // pushState () -- 3 parameters, 1) state object 2) title and a URL)
    window.history.pushState('', "", '/');
    document.title = "TestEra.Club";

    analytics.logEvent('Clear All clicked', { name: '' });
    document.getElementById("loader").setAttribute("hidden", "");

}

function copyOutput() {

    if (TestorStoriesType == "testcases") {
       type1 = "Test Cases";
    }
    if (TestorStoriesType == "userstories") {
        type1 = "User Stories";
    }

    //  var  outputAnswerToDisplay = document.getElementById('outputAnswerToDisplay');
    let textToCopy = "Query for "+type1 + "\n" + "Query - " + input + "\n" + "Complexity - " + complexity * 10 + "\nOutput - " + output;
    navigator.clipboard.writeText(textToCopy);

    document.getElementById('copyButton').value = "Copied..";

    analytics.logEvent('Output Copied', { name: '' });

}



//to add to db
var input;
var output;
let totaltokensused;
let querytokensused;
let answertokensused;
var firebasePrimaryId;

function addDataToDB() {

    const database = firebase.database();
    const usersRef = database.ref('/TestEraAssistant');
    const autoId = usersRef.push().key

    usersRef.child(autoId).set({

        input: input.trim(),
        output: output.trim(),
        userId: userId,
        totaltokensused: totaltokensused,
        querytokensused: querytokensused,
        answertokensused: answertokensused,
        TestorStoriesType: TestorStoriesType,
        complexity: complexity,
        createdDate: firebase.database.ServerValue.TIMESTAMP,

    })

    firebasePrimaryId = autoId;

    updateURLandTitle();

    //add tokens used against the user // will be needed later or data analysis
    //logged in user -- add tokens used with its own row
    //but if user is not logged in a row for all users with undefined key is updated , this will hold all non logged users total used tokens
    updateTokensUsedByUser();
    addmyUsedTokensKaLog();

}

function updateURLandTitle() {

    //update the title and url q string each time new query is done
    // pushState () -- 3 parameters, 1) state object 2) title and a URL)
    window.history.pushState('', "", '?id=' + firebasePrimaryId);
    // document.title = "TestEra.Club - "+input;

}


//keep adding user used tokens to db start

function updateTokensUsedByUser() {


    const database = firebase.database();


    database.ref('/myUsedTokens/' + userId).update({
        totaltokensused: firebase.database.ServerValue.increment(totaltokensused)
    }),

        database.ref('/myUsedTokens/' + userId).update({
            querytokensused: firebase.database.ServerValue.increment(querytokensused)
        }),

        database.ref('/myUsedTokens/' + userId).update({
            answertokensused: firebase.database.ServerValue.increment(answertokensused)
        })

    // database.ref('/UserUsedTokens/' +userId).update({ 
    // lastUpdatedDate:firebase.database.ServerValue.set(firebase.database.ServerValue.TIMESTAMP)})


}

//add user used tokens to db end

function addmyUsedTokensKaLog() {

    const database = firebase.database();
    const usersRef = database.ref('/myUsedTokensKaLog');
    const autoId = usersRef.push().key

    usersRef.child(autoId).set({

        userId: userId,
        totaltokensused: totaltokensused,
        createdDate: firebase.database.ServerValue.TIMESTAMP,

    })

}


//sharing url with friends with the key of data

function shareURL() {


    urltoshare = "https://testera.club/?id=" + firebasePrimaryId;

    navigator.clipboard.writeText(urltoshare);

    document.getElementById('shareButton').value = "Link to share Copied..";

    analytics.logEvent('Link shared', { name: '' });

}


// START 
//when user opens the link shared 
//pull data using qstring and display on textarea and output label

var sharedfirebasePrimaryId1 = new URLSearchParams(window.location.search);
var sharedfirebasePrimaryId = sharedfirebasePrimaryId1.get('id') //get id from query string 


//only trigger this if there is query string in the url
if (sharedfirebasePrimaryId !== null) {
    firebasePrimaryId = sharedfirebasePrimaryId;  //this is needed because -- when user opens link sent by other user and shares it without clicking ask , url still has key of what was shared
    getDataOfSharedQuestion();
}


function getDataOfSharedQuestion() {

    var sharedQueryArray = [];

    const database = firebase.database();

    database.ref('/TestEraAssistant').orderByKey()
        .equalTo(sharedfirebasePrimaryId).limitToLast(1)
        .once("value", function (ALLRecords) {
            ALLRecords.forEach(
                function (CurrentRecord) {

                    input = CurrentRecord.val().input;
                    output = CurrentRecord.val().output;
                    complexity = CurrentRecord.val().complexity;
                    TestorStoriesType = CurrentRecord.val().TestorStoriesType;
                   
                    var sharedQueryObj =
                    {
                        "input": input,
                        "output": output,
                        "complexity": complexity,
                        "TestorStoriesType": TestorStoriesType,
                    };
                    sharedQueryArray.push(sharedQueryObj)
                   

                });


            if (sharedQueryArray.length == 0)
            {
                document.getElementById('validation').innerText = "The test cases / user stories you are looking for are not found. Please check the URL. Click clear button and search a new query.";
            }

            document.getElementById("loader").setAttribute("hidden", "");

            //when the query id is present in db or is not wrong in url
            if (sharedQueryArray.length > 0)
            {
                var placeholderTextLabel = document.getElementById('outputAnswerToDisplay');
                placeholderTextLabel.innerText = "Complexity = " + sharedQueryArray[0].complexity * 10 + "\n\n" + sharedQueryArray[0].output.trim().slice(0, 5000);

                var textAreaplaceholederText1 = document.getElementById('user_requirement');
                textAreaplaceholederText1.value = sharedQueryArray[0].input.trim();     

                if (sharedQueryArray[0].TestorStoriesType == "testcases") {
                    document.getElementById('TestorStoriesType').innerText = "Test cases";
                    document.getElementById('copyButton').value = "Copy Test Cases";
                }
                if (sharedQueryArray[0].TestorStoriesType == "userstories") {
                    document.getElementById('TestorStoriesType').innerText = "User Stories";
                    document.getElementById('copyButton').value = "Copy User Stories";
                }

                //update the page title
                // document.title = "TestEra.Club - "+input;
                document.getElementById('shareButton').value = "Share this";
                document.getElementById('shareButton').disabled = false;

                document.getElementById('copyButton').disabled = false;
            }
            analytics.logEvent('Shared TestCases/UserStories viewed', { name: '' });

        });

       
}
// END


// start
//get a different placeholder in the textarea every time page is loaded, only trigger this if there is NO query string in the url
if (sharedfirebasePrimaryId == null) {
    getDataOfPlaceholderContent();
}

function getDataOfPlaceholderContent() {

    var placeholderTextArray = [];

    const database = firebase.database();

    database.ref('/PlaceholderText').orderByChild("createdDate")
        .limitToLast(10)
        .once("value", function (ALLRecords) {
            ALLRecords.forEach(
                function (CurrentRecord) {

                    var placeholderText = CurrentRecord.val().placeholderText;

                    var placeholderTextObj =
                    {
                        "placeholderText": placeholderText,
                    };
                    placeholderTextArray.push(placeholderTextObj)

                });

            
            //set any random placeholder in textarea  from DB when page is reloaed
            let randomNum = Math.floor(Math.random() * placeholderTextArray.length);

            // because if not here  this loads first and if connection is slow new placeholder takes time to load and this shows up
            //this is just a backup if placeholer pulling from dbfails 

            // document.getElementById('user_requirement').placeholder = "Eg. Ecommerce buy and shipping journey";
            document.getElementById("loader").setAttribute("hidden", "");
            document.getElementById('user_requirement').placeholder = placeholderTextArray[randomNum].placeholderText;


        });

}
//end

function addCredits() {


    analytics.logEvent('User tried to add credits', { name: '' });


}



function beYwbUH4XJ2F6bPYUefH() {


    const database = firebase.database();
    const usersRef = database.ref('/beYwbUH4XJ2F6bPYUefH');
    const autoId = usersRef.push().key

    usersRef.child(autoId).set({

        input: input.trim(),
        userId: userId,
        createdDate: firebase.database.ServerValue.TIMESTAMP,

    })


}

function rpT7Y6a8WRF() {
    const database = firebase.database();
    const usersRef = database.ref('/rpT7Y6a8WRF');
    const autoId = usersRef.push().key

    usersRef.child(autoId).set({

        userId: userId,
        createdDate: firebase.database.ServerValue.TIMESTAMP,

    })
}



//who is it for
//Testers , Developers, Managers, business owners

// addPlaceholderDataToDB();

// function addPlaceholderDataToDB(){



//     const database = firebase.database();
//     const usersRef = database.ref('/PlaceholderText');
//     const autoId = usersRef.push().key

//     usersRef.child(autoId).set({

//     placeholderText: "Eg. ecommerce coupon referral system",
//      createdDate: firebase.database.ServerValue.TIMESTAMP,

//     })

//     firebasePrimaryId = autoId;
//     console.log("placeholder added");

// }




//all regarding credits

//when the user signs in , give them 5 credtis

//first check if user is new 
function isUserNew() {

    var ref = firebase.database().ref(`myCredits/${userId}`);
    ref.once("value")
        .then(function (snapshot) {
            var a = snapshot.exists();  // true if user exists

            if (a == true) {
                console.log("user is not new")

                getRemainingCredits();

            }
            if (a == false) {
                console.log("user is new")
                createMyCreditsUser();
            }
        });


}


function createMyCreditsUser() {

    const database = firebase.database();
    const usersRef = database.ref('/myCredits');

    usersRef.child(userId).set({

        userId: userId,
        creditsRemaining: 0,

    })
    creditsToOffer = 10;

    creditACredit(creditsToOffer);

}

var creditsToOffer;
var creditMessage;
function creditACredit(creditsToOffer) {

    var userRef = firebase.database().ref(`myCredits/${userId}`);
    userRef.update({
        creditsRemaining: firebase.database.ServerValue.increment(creditsToOffer),

    });
    creditMessage = "10 Free trial credits";
    getRemainingCredits();
    creditACreditLog(creditsToOffer, creditMessage);
}

function creditACreditLog(creditsToOffer, creditMessage) {

    const database = firebase.database();
    const usersRef = database.ref('/myCreditsKaLog');
    const autoId = usersRef.push().key;

    usersRef.child(autoId).set({

        userId: userId,
        creditsDebited: 0,
        creditsCredited: creditsToOffer,
        creditMessage: creditMessage,
        createdDate: firebase.database.ServerValue.TIMESTAMP,

    })
}


function debitACredit() {

    var userRef = firebase.database().ref(`myCredits/${userId}`);
    userRef.update({
        creditsRemaining: firebase.database.ServerValue.increment(-1)
    });

    getRemainingCredits();
    debitACreditLog();
}

function debitACreditLog() {

    const database = firebase.database();
    const usersRef = database.ref('/myCreditsKaLog');
    const autoId = usersRef.push().key;

    usersRef.child(autoId).set({

        userId: userId,
        creditsDebited: 1,
        creditsCredited: 0,
        creditMessage: "Query for " + TestorStoriesType,
        createdDate: firebase.database.ServerValue.TIMESTAMP,

    })
}

function getRemainingCredits() {

    const database = firebase.database();

    database.ref('/myCredits').orderByChild("userId").equalTo(userId)
        .once("value", function (ALLRecords) {
            ALLRecords.forEach(
                function (CurrentRecord) {

                    creditsRemaining = CurrentRecord.val().creditsRemaining;
                    // var userId111 = CurrentRecord.val().userId;

                    if(creditsRemaining <= 5){
                        document.getElementById('remainingCredits').style.color="red";
                        document.getElementById('creditsLeft').style.color="red";
                    }
                    document.getElementById('remainingCredits').innerText = creditsRemaining + " Credits Remaining";
                    document.getElementById('creditsLeft').innerText ="Credits Remaining - "+creditsRemaining;
                    
                });


        });


    document.getElementById('submitRequirements_TestCases').disabled = false;
    document.getElementById('submitRequirements_UserStories').disabled = false;

}