



//login start
var userId = null;
var user_Email;
var selectedOptionForTestCases=null;

//to do on page load start
analytics.logEvent('TestEra Virtual Assistant page visited', { name: '' });
//disable the copy button till output is written

//disable now, enable them when credits are fetched
document.getElementById('submitRequirements_TestCases').disabled = true;

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
            // console.log("not user1");
            document.getElementById('submitRequirements_TestCases').disabled = false;

            document.getElementById('goToAccount').style.visibility = "hidden";
            document.getElementById('goToAccount1').style.visibility = "hidden";

            document.getElementById('validation1').innerText = "Sign In to add / manage credits";

            document.getElementById('remainingCredits').innerText = "";
            document.getElementById('creditsLeft').innerText = "";
            
           


        }
        if (user) {
            var userisAorNot = user.isAnonymous.toString();

            if (userisAorNot === "true") {
                // if user isAnonymous and not logged in 
                document.getElementById("LogInButton").style.visibility = "visible";
                document.getElementById("loggedinemail").style.visibility = "hidden";
                document.getElementById("logoutButton").style.visibility = "hidden";
                // console.log("not user2");
                document.getElementById('submitRequirements_TestCases').disabled = false;


                document.getElementById('goToAccount').style.visibility = "hidden";
                document.getElementById('goToAccount1').style.visibility = "hidden";

                document.getElementById('validation1').innerText = "Login to add / manage credits";
                document.getElementById('remainingCredits').innerText = "";
                document.getElementById('creditsLeft').innerText = "";

            }
            if (userisAorNot === "false") {
                //if user is logged in
                document.getElementById("LogInButton").style.visibility = "hidden";
                document.getElementById("loggedinemail").style.visibility = "visible";
                document.getElementById("logoutButton").style.visibility = "visible";

                document.getElementById("loggedinemail").innerText = "Logged in as " + user.email.slice(0, 25);  // email display first 15 chars
                // console.log("user");
                userId = user.uid;
                user_Email=user.email

                document.getElementById('goToAccount').style.visibility = "visible";
                document.getElementById('goToAccount1').style.visibility = "visible";


                isUserNew();

            }


        }
    })
}



function logIn() {

    location.replace('/Login');


}



function logOut() {

    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        userId = null // have to do or user id logic on page works as if user was logged even when logged out

        document.getElementById("LogInButton").style.visibility = "visible";
        document.getElementById("loggedinemail").style.visibility = "hidden";
        document.getElementById("logoutButton").style.visibility = "hidden";

      }).catch((error) => {
        // An error happened.
      });
    
}

// login end

var requirements
var topOutputHeading
var complexity;
var creditsRemaining = 0;


//called on test cases button click
function gatherTestCasesDataToSend() {

   

    //only logged in users can query
    if (userId == null) {
        document.getElementById('validation').innerText = "Sign In (takes just ~10 secs) to Generate Test Cases";
        analytics.logEvent('TestEra tried asking without login', { name: '' });
        
    }

    //only logged in users can query
    if (userId !== null) {

        if (creditsRemaining <= 0) {
            document.getElementById('validation').innerText = "It costs a lot of $$ to process this queries. You've used all of your 10 free credits. If you want to save time, effort and improve the quality of your test cases, add more credits to your account by clicking 'Add Credits' button below.";
            analytics.logEvent('TestEra user used till limit', { name: '' });
            rpT7Y6a8WRF();
        }

        if (creditsRemaining > 0) {


            //validate if field is not empty. //this is the input sent to AI
            var queryByUser = document.getElementById('user_requirement').value.trim();
            dropDownSelectedValue = document.querySelector(".sBtn-text");
            selectedOptionForTestCases = dropDownSelectedValue.value;


            if (queryByUser == null || queryByUser == "") {
                document.getElementById('validation').innerText = "Enter requirement to generate Test Cases";
                return false;
            } 
            if (queryByUser.length > 500) {
                document.getElementById('validation').innerText = "Too long, 500 chars max";
                return false;
            }
            if (selectedOptionForTestCases == null || selectedOptionForTestCases == "") {
                document.getElementById('validation').innerText = "Select an option for what type of Test Cases needs to be generated.";
                return false;
            }

            document.getElementById("loader").removeAttribute("hidden");
            document.getElementById('shareButton').value = "Share this";
            document.getElementById('copyButton').disabled = true;
            document.getElementById("shareButton").disabled = true;
            document.getElementById("clearBox").disabled = true;
            document.getElementById("logoutButton").disabled = true;

            document.getElementById('validation').innerText = "";

            var showProgress = document.getElementById('outputAnswerToDisplay');
            showProgress.value = "Thinking...This may take a few seconds. Please Wait...";

            const outputLabelComplexity = document.getElementById('outputLabelComplexity');
            outputLabelComplexity.innerText=  "";


            document.getElementById('submitRequirements_TestCases').value = "Thinking...";
            document.getElementById('submitRequirements_TestCases').disabled = true;

            document.getElementById('topOutputHeading').innerText = "OUTPUT"
            document.getElementById('copyButton').value = "Copy Test Cases";

            // for adding to DB
            input = queryByUser.trim();

            

            var complexityelement = document.getElementById("complexityrange");
            var complexity1 = complexityelement.value;
            complexity = complexity1 / 10;
            // console.log("complexity= " + complexity);


            //first moderate query send requirements to python and get the AI generated result

            moderateContent(queryByUser, selectedOptionForTestCases, complexity);

            //log event
            TestCasesButtonClicked();
        }
    }

}


function TestCasesButtonClicked() {

    analytics.logEvent('Generate Test cases Button clicked', { name: '' });

}


//moderate user query and warn of content violates policies
var isQueryContentBad;
function moderateContent(queryByUser, selectedOptionForTestCases, complexity) {

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
            document.getElementById('outputAnswerToDisplay').value = "This Query violates our content policies, no output is displayed.";

            document.getElementById('topOutputHeading').innerText = "Bad request";
            document.getElementById('submitRequirements_TestCases').value = "Generate";
            document.getElementById('submitRequirements_TestCases').disabled = false;


            beYwbUH4XJ2F6bPYUefH();

        }

        if (isQueryContentBad == "false") {
           
                askAI(queryByUser, selectedOptionForTestCases, complexity);

        }

    }

    request.send();

}



// get the response generated by AI
var responsefromAI;
function askAI(queryByUser, selectedOptionForTestCases, complexity) {

    let querysentToAI = queryByUser;


    //send the info requirement as query string

    const request = new XMLHttpRequest();
    request.open("POST", '/askAI?requirement=' + querysentToAI + "&type=" + selectedOptionForTestCases + "&complexity=" + complexity, true);

    request.onload = () => {
 
       responsefromAI = request.responseText //response from AI 
       
        if(request.status ==200){
        debitACredit();
        displayOutput(responsefromAI);   //display the resonse on UI
        getRemainingCredits();
        debitACreditLog();
        }
        else{
            document.getElementById('validation').innerText = "Some error occurred, please refresh the page and try again";
            document.getElementById('outputAnswerToDisplay').value = "Some error occurred, please refresh the page and try again";
        }
    }

    request.send();

}



// display answer on UI
function displayOutput(responsefromAI) {

    document.getElementById('submitRequirements_TestCases').value = "Generate";


    // convert data into JSON object
    var parsedData = JSON.parse(responsefromAI);
    
    let totaltokensused1 = parsedData.usage.total_tokens;
    let querytokensused1 = parsedData.usage.prompt_tokens;
    let answertokensused1 = parsedData.usage.completion_tokens;

    document.getElementById("loader").setAttribute("hidden", "");
    document.getElementById("outputAnswerToDisplay").value = "";

    cleanDataArray = []
    for (z = 0; z < parsedData.choices.length; z++){
       
        let cleanData = parsedData.choices[z].text.trim();
       
        var cleanDataObj =
        {
            "cleanData": cleanData,
        };
        cleanDataArray.push(cleanDataObj)
    }

    // to add data to a new line
    newlinesData= [];

    if(selectedOptionForTestCases == "FTC" || selectedOptionForTestCases == "ETC"){
        for (w = 0; w < cleanDataArray.length; w++) {
            newlinesData[w] = "\n" + cleanDataArray[w].cleanData + "\n";
        }
        newlinesData = newlinesData.join("");    
    }
   

    if(selectedOptionForTestCases == "NTC" || selectedOptionForTestCases == "MCUI")
    {
    newlinesData = cleanDataArray[0].cleanData.split("\n");

    for (i = 0; i < cleanDataArray.length; i++) {
        newlinesData[i] = "\n" + newlinesData[i] + "\n";
    }
    newlinesData = newlinesData.join("");
    }

    var i = 0;
    var txt = newlinesData;
    var speed = -1000;
    typeWriter();
    
    //code to add a each data to next line when all data is in one choices[].text 
    // newlinesData = cleanData.split("\n");

    // for (let i = 0; i < newlinesData.length; i++) {
    //     newlinesData[i] = "\n" + newlinesData[i] + "\n";
    // }
    // newlinesData = newlinesData.join("");

    // const outputLabel = document.getElementById('outputAnswerToDisplay');
    // outputLabel.value =  newlinesData;
    
    function typeWriter() {
        if (i < txt.length) {
            document.getElementById("outputAnswerToDisplay").value += txt.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
            
        }
    }

    const outputLabelComplexity = document.getElementById('outputLabelComplexity');
    outputLabelComplexity.innerText=  "Complexity = " + complexity * 10 
    
     //set the title of answer based on what the query was

    if (selectedOptionForTestCases == "FTC") {
        document.getElementById('topOutputHeading').innerText = "Functional Test Cases";
    }
    if (selectedOptionForTestCases == "ETC") {
        document.getElementById('topOutputHeading').innerText = "Edge Test Cases";
    }
    if (selectedOptionForTestCases == "NTC") {
        document.getElementById('topOutputHeading').innerText = "Negative Test Cases";
    }
    if (selectedOptionForTestCases == "UFTC") {
        document.getElementById('topOutputHeading').innerText = "User flow Test Cases";
    }
    if (selectedOptionForTestCases == "PTC") {
        document.getElementById('topOutputHeading').innerText = "Performance Test Cases";
    }
    if (selectedOptionForTestCases == "STC") {
        document.getElementById('topOutputHeading').innerText = "Security Test Cases";
    }
    if (selectedOptionForTestCases == "UIUCTC") {
        document.getElementById('topOutputHeading').innerText = "UI and UX Test Cases";
    }
    if (selectedOptionForTestCases == "MCUI") {
        document.getElementById('topOutputHeading').innerText = "Most common user inputs";
    }
    if (selectedOptionForTestCases == "PRE") {
        document.getElementById('topOutputHeading').innerText = "Preconditions for a requirement.";
    }
    if (selectedOptionForTestCases == "SBREAK") {
        document.getElementById('topOutputHeading').innerText = "Scenarios where this feature might break";
    }
    if (selectedOptionForTestCases == "UNEXPECTED") {
        document.getElementById('topOutputHeading').innerText = "Some unexpected ways that users might use this feature";
    }
    if (selectedOptionForTestCases == "BUG") {
        document.getElementById('topOutputHeading').innerText = "Create a bug report for a defect";
    }
    

    //enable the copy button
    document.getElementById("copyButton").disabled = false;
    document.getElementById("shareButton").disabled = false;
    document.getElementById("clearBox").disabled = false;
    document.getElementById("logoutButton").disabled = false;

    // for adding to DB
    output = newlinesData;
    totaltokensused = totaltokensused1;
    querytokensused = querytokensused1;
    answertokensused = answertokensused1;


    
    addDataToDB();


}



function clearAll() {

    // getDataOfPlaceholderContent();

    document.getElementById('submitRequirements_TestCases').value = "Generate";
    document.getElementById('submitRequirements_TestCases').disabled = false;
    document.getElementById('selectedOption').disabled = false;


    document.getElementById('topOutputHeading').innerText = "Output";
    document.getElementById('outputAnswerToDisplay').value = "";

    var textAreaplaceholeder = ""
    var textAreaplaceholederText1 = document.getElementById('user_requirement');
    textAreaplaceholederText1.value = textAreaplaceholeder;

    document.getElementById('validation').innerText = "";


    document.getElementById('copyButton').value = "Copy Output";
    document.getElementById('copyButton').disabled = true;
    document.getElementById('shareButton').value = "Share this";
    document.getElementById('shareButton').disabled = true;
    document.getElementById("logoutButton").disabled = false;

    //update the title and url and title to just domain
    // pushState () -- 3 parameters, 1) state object 2) title and a URL)
    window.history.pushState('', "", '/');
    document.title = "TestEra.Club";

    analytics.logEvent('Clear All clicked', { name: '' });
    document.getElementById("loader").setAttribute("hidden", "");

}

function copyOutput() {

    if (selectedOptionForTestCases == "FTC") {
        type1 = "Functional Test Cases";
    }
    if (selectedOptionForTestCases == "ETC") {
        type1 = "Edge Test Cases";
    }
    if (selectedOptionForTestCases == "NTC") {
        type1 = "Negative Test Cases";
    }
    if (selectedOptionForTestCases == "UFTC") {
        type1 = "User flow Test Cases";
    }
    if (selectedOptionForTestCases == "PTC") {
        type1 = "Performance Test Cases";
    }
    if (selectedOptionForTestCases == "STC") {
        type1 = "Security Test Cases";
    }
    if (selectedOptionForTestCases == "UIUCTC") {
        type1 = "UI and UX Test Cases";
    }
    if (selectedOptionForTestCases == "MCUI") {
        type1 = "Most common user inputs";
    }
    if (selectedOptionForTestCases == "PRE") {
        type1 = "Preconditions for a requirement";
    }
    if (selectedOptionForTestCases == "SBREAK") {
        type1 = "Scenarios where this feature might break";
    }
    if (selectedOptionForTestCases == "UNEXPECTED") {
        type1 = "What are some unexpected ways that users might use this feature";
    }
    if (selectedOptionForTestCases == "BUG") {
        type1 = "Create a bug report for a defect";
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
        selectedOptionForTestCases: selectedOptionForTestCases,
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
    document.title = "TestEra.Club - "+input;

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
                    selectedOptionForTestCases = CurrentRecord.val().selectedOptionForTestCases;
                   
                    var sharedQueryObj =
                    {
                        "input": input,
                        "output": output,
                        "complexity": complexity,
                        "selectedOptionForTestCases": selectedOptionForTestCases,
                    };
                    sharedQueryArray.push(sharedQueryObj)
                   

                });


            if (sharedQueryArray.length == 0)
            {
                document.getElementById('validation').innerText = "The test cases you are looking for are not found. Please check the URL. Click clear button and search a new query.";
            }

            document.getElementById("loader").setAttribute("hidden", "");

            //when the query id is present in db or is not wrong in url
            if (sharedQueryArray.length > 0)
            {
                
                newlinesData = sharedQueryArray[0].output.trim().slice(0, 5000).split("\n");
                for (let i = 0; i < newlinesData.length; i++) {
                    newlinesData[i] = "\n" + newlinesData[i];
                }
                newlinesData = newlinesData.join("");
        

               
                if(selectedOptionForTestCases == "NTC")
                {
                newlinesData = sharedQueryArray[0].output.split("\n");
                console.log(newlinesData) 

                for (let i = 0; i < sharedQueryArray.length; i++) {
                    newlinesData[i] = "\n" + newlinesData[i] + "\n";
                }
                newlinesData = newlinesData.join("");
                }
                // const outputLabel = document.getElementById('outputAnswerToDisplay');
                // outputLabel.value =  newlinesData;

                var i = 0;
                var txt = newlinesData;
                var speed = -1000;

                typeWriter();
                function typeWriter() {
                if (i < txt.length) {
                    document.getElementById("outputAnswerToDisplay").innerHTML += txt.charAt(i);
                    i++;
                    setTimeout(typeWriter, speed);
                }
                }

                const outputLabelComplexity = document.getElementById('outputLabelComplexity');
                outputLabelComplexity.innerText=  "Complexity = " + sharedQueryArray[0].complexity * 10

                var textAreaplaceholederText1 = document.getElementById('user_requirement');
                textAreaplaceholederText1.value = sharedQueryArray[0].input.trim();     


                if (sharedQueryArray[0].selectedOptionForTestCases == "FTC") {
                    document.getElementById('topOutputHeading').innerText = "Functional Test Cases";
                }
                if (sharedQueryArray[0].selectedOptionForTestCases == "ETC") {
                    document.getElementById('topOutputHeading').innerText = "Edge Test Cases";
                }
                if (sharedQueryArray[0].selectedOptionForTestCases == "NTC") {
                    document.getElementById('topOutputHeading').innerText = "Negative Test Cases";
                }
                if (sharedQueryArray[0].selectedOptionForTestCases == "UFTC") {
                    document.getElementById('topOutputHeading').innerText = "User flow Test Cases";
                }
                if (sharedQueryArray[0].selectedOptionForTestCases == "PTC") {
                    document.getElementById('topOutputHeading').innerText = "Performance Test Cases";
                }
                if (sharedQueryArray[0].selectedOptionForTestCases == "STC") {
                    document.getElementById('topOutputHeading').innerText = "Security Test Cases";
                }
                if (sharedQueryArray[0].selectedOptionForTestCases == "UIUCTC") {
                    document.getElementById('topOutputHeading').innerText = "UI and UX Test Cases";
                }
                if (sharedQueryArray[0].selectedOptionForTestCases == "MCUI") {
                    document.getElementById('topOutputHeading').innerText = "Most common user inputs";
                }
                if (sharedQueryArray[0].selectedOptionForTestCases == "PRE") {
                    document.getElementById('topOutputHeading').innerText = "Preconditions for a requirement";
                }
                if (sharedQueryArray[0].selectedOptionForTestCases == "SBREAK") {
                    document.getElementById('topOutputHeading').innerText = "Scenarios where this feature might break";
                }
                if (sharedQueryArray[0].selectedOptionForTestCases == "UNEXPECTED") {
                    document.getElementById('topOutputHeading').innerText = "Some unexpected ways that users might use this feature";
                }
                if (sharedQueryArray[0].selectedOptionForTestCases == "BUG") {
                    document.getElementById('topOutputHeading').innerText = "Create a bug report for a defect";
                }
            

                //update the page title
                // document.title = "TestEra.Club - "+input;
                document.getElementById('shareButton').value = "Share this";
                document.getElementById('shareButton').disabled = false;

                document.getElementById('copyButton').disabled = false;
            }
            analytics.logEvent('Shared TestCases viewed', { name: '' });

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
            
            var i = 0;
            var txt = "\n\nGenerate\n\n-Functional Test Cases \n-Edge test cases \n-Negative test cases \n-User flow test cases \n-Performance test cases \n-Security test cases \n-UI and UX test cases \n-Most common user inputs \n-Scenarios where this feature might break \n-What are some unexpected ways that users might use this feature?\n-Create a bug report for a defect\n\n\nThe best way to get better results is to ask your requirements multiple times with different wording and different complexity values. A large number of possible test cases an be generated this way."
            var speed = -1000;

            typeWriter();
            function typeWriter() {
            if (i < txt.length) {
                document.getElementById("outputAnswerToDisplay").placeholder += txt.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
            }

        });

}
//end




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
                // console.log("user is not new")

                getRemainingCredits();

            }
            if (a == false) {
                // console.log("user is new")
                createMyCreditsUser();
            }
        });


}


function createMyCreditsUser() {

    const database = firebase.database();
    const usersRef = database.ref('/myCredits');

    usersRef.child(userId).set({

        userId: userId,
        user_Email: user_Email,
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

}

function debitACreditLog() {

    const database = firebase.database();
    const usersRef = database.ref('/myCreditsKaLog');
    const autoId = usersRef.push().key;

    usersRef.child(autoId).set({

        userId: userId,
        creditsDebited: 1,
        creditsCredited: 0,
        creditMessage: "Query for " + topOutputHeading,
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
                    document.getElementById('creditsLeft').innerText = creditsRemaining+" Credits Remaining";
                    
                });


        });


    document.getElementById('submitRequirements_TestCases').disabled = false;


}

function AddCredits(){
    location.replace('/Account');
}



var elem = document.querySelector('input[type="range"]');

var rangeValue = function () {
    var newValue = elem.value;
    var target = document.querySelector('.value');
    target.innerHTML = newValue;
}

elem.addEventListener("input", rangeValue);

getDropDownListValue()
function getDropDownListValue(){
    var optionMenu = document.querySelector(".select-menu"),
    selectBtn = optionMenu.querySelector(".select-btn"),
    options = optionMenu.querySelectorAll(".option"),
    
    sBtn_text = optionMenu.querySelector(".sBtn-text");

  
  selectBtn.addEventListener("click", () =>
    optionMenu.classList.toggle("active")
  );
  
  options.forEach((option) => {
    option.addEventListener("click", () => {
      let selectedOption = option.querySelector(".option-text").innerText;
      sBtn_text.innerText = selectedOption;
      

      let selectedOption1 = option.querySelector(".option-text").value;
      
      sBtn_text.value = selectedOption1;

      optionMenu.classList.remove("active");
      
  
    });
  });
}