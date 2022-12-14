

// code to create a immage and add text to it so that it can be shared
<canvas id="idCanvas"></canvas> 

function shareImage(){
    
    
    let canvas = document.getElementById('idCanvas');
    let ctx = canvas.getContext('2d');
    
    canvas.width = 600;
    canvas.height = 800;
    canvas.style="border:1px solid #000000";
    
    // @description: wrapText wraps HTML canvas text onto a canvas of fixed width
    // @param ctx - the context for the canvas we want to wrap text on
    // @param text - the text we want to wrap.
    // @param x - the X starting point of the text on the canvas.
    // @param y - the Y starting point of the text on the canvas.
    // @param maxWidth - the width at which we want line breaks to begin - i.e. the maximum width of the canvas.
    // @param lineHeight - the height of each line, so we can space them below each other.
    // @returns an array of [ lineText, x, y ] for all lines
    const wrapText = function(ctx, text, x, y, maxWidth, lineHeight) {
        // First, start by splitting all of our text into words, but splitting it into an array split by spaces
        let words = text.split(' ');
        let line = ''; // This will store the text of the current line
        let testLine = ''; // This will store the text when we add a word, to test if it's too long
        let lineArray = []; // This is an array of lines, which the function will return
    
        // Lets iterate over each word
        for(var n = 0; n < words.length; n++) {
            // Create a test line, and measure it..
            testLine += `${words[n]} `;
            let metrics = ctx.measureText(testLine);
            let testWidth = metrics.width;
            // If the width of this test line is more than the max width
            if (testWidth > maxWidth && n > 0) {
                // Then the line is finished, push the current line into "lineArray"
                lineArray.push([line, x, y]);
                // Increase the line height, so a new line is started
                y += lineHeight;
                // Update line and test line to use this word as the first word on the next line
                line = `${words[n]} `;
                testLine = `${words[n]} `;
            }
            else {
                // If the test line is still less than the max width, then add the word to the current line
                line += `${words[n]} `;
            }
            // If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something
            if(n === words.length - 1) {
                lineArray.push([line, x, y]);
            }
        }
        // Return the line array
        return lineArray;
    }
    
    
    // Add gradient
    let grd = ctx.createLinearGradient(0, 600, 800, 0);
    grd.addColorStop(0, '#00a0ff');
    grd.addColorStop(1, '#3785bd');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 600, 800);
    
    // More text
    ctx.font = '400 20px Helvetica';
    ctx.fillStyle = 'white';

    // wrapText (canvs , text , x , y , wrap , sqeeze)
    let wrappedTextQuery = wrapText(ctx,"Question - "+input.trim().slice(0,300) , 65, 100, 490, 30);
    
    let wrappedTextAnswer = wrapText(ctx,"Answer - "+output.trim().slice(0,700) , 65, 300, 490, 30);
    
    let wrappedTextInfo = wrapText(ctx, "This was Generated by TestEra AI - www.testera.club", 65, 750, 490, 30);
    
    wrappedTextQuery.forEach(function(item) {
        ctx.fillText(item[0], item[1], item[2]); 
    })
    
    wrappedTextInfo.forEach(function(item) {
       ctx.fillText(item[0], item[1], item[2]); 
    })
    
    wrappedTextAnswer.forEach(function(item) {
       ctx.fillText(item[0], item[1], item[2]); 
    })
       
    
    }


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

