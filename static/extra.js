

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

// server installation needed
// pip3 install openai
// pip3 install python-dotenv --- for env variables

