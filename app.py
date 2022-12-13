import os
import openai
from dotenv import load_dotenv
load_dotenv()



from flask import Flask, render_template ,request, redirect, session
app = Flask(__name__)


#openai.api_key = os.getenv("OPENAI_API_KEY")
openai.api_key = "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"


@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/terms')
def terms():
    return render_template('terms.html')    


# all code for personal assistant

@app.route('/')
def ai():
    return render_template('ai.html')

@app.route('/askAI',methods = ['POST','GET'])
def callPythonScriptPA():
    # requirement send from js
    type = request.args.get('type')

    if type== "testcases":
        requirement = "Write test cases for "+request.args.get('requirement')
    
    if type== "userstories":
        requirement = "Write user stories for "+request.args.get('requirement')
   
    else:
         requirement = "Write test cases for "+request.args.get('requirement')


    outputTestCases = openai.Completion.create(
    model="text-davinci-003",
    prompt=requirement,
    temperature=0,
    max_tokens=500,
    top_p=1,
    frequency_penalty=0.0,
    presence_penalty=0.0
    )
    
    
    return outputTestCases


if __name__ == '__main__':
    app.run(debug=True)
    


