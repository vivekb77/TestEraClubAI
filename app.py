import os
import openai
from dotenv import load_dotenv, find_dotenv
import stripe
import json
load_dotenv(find_dotenv())
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import time




from flask import Flask, render_template ,request, redirect, session, jsonify

app = Flask(__name__)


openai.api_key = os.getenv("OPENAI_API_KEY")
# openai.api_key = "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"


@app.route('/ContactUs')
def ContactUs():
    return render_template('contact.html')

@app.route('/TermsOfService')
def TermsOfService():
    return render_template('TermsOfService.html') 

@app.route('/PrivacyPolicy')
def PrivacyPolicy():
    return render_template('PrivacyPolicy.html')

@app.route('/UsageGuidelines')
def UsageGuidelinesguidelines():
    return render_template('UsageGuidelines.html')        

@app.route('/Login')
def Login():
    return render_template('login.html') 
  

@app.route('/Account')
def AccountView():
    return render_template('account.html')            


@app.route('/')
def ai():
    return render_template('ai.html')


@app.route('/askAI',methods = ['POST','GET'])
def callPythonScriptPA():
    # requirement send from js
    TestCaseType = str(request.args.get('type'))
    temperature = float(request.args.get('complexity'))
    # print(temperature)


    if TestCaseType == 'FTC':
        requirement =   request.args.get('requirement')+"->"
        model="text-davinci-003"
        numberofOutputs=10
        # model="davinci:ft-personal-2022-12-28-06-50-06"
        maxTokens=100
        
    if TestCaseType == 'ETC':
        requirement =   request.args.get('requirement')+"->"
        # model="curie:ft-personal-2022-12-28-06-07-46"
        numberofOutputs=10
        model="text-davinci-003"
        maxTokens=100

    if TestCaseType == 'NTC':
        requirement =  "Write 30 functional test cases for the following. " + "Text: \"\"\" " + request.args.get('requirement') + " \"\"\" "
        model="text-davinci-003"
        numberofOutputs=1
        maxTokens=500

    if TestCaseType == 'UFTC':
        requirement =  "Write 30 User flow test cases for the following. "+ "Text: \"\"\" " + request.args.get('requirement') + " \"\"\" "
        model="text-davinci-003"
        numberofOutputs=1
        maxTokens=500

    if TestCaseType == 'PTC':
        requirement =  "Write 30 Performance test cases for the following. " + "Text: \"\"\" " + request.args.get('requirement') + " \"\"\" "
        model="text-davinci-003"
        numberofOutputs=1
        maxTokens=500

    if TestCaseType == 'STC':
        requirement =  "Write 15 Security test cases for the following. " + "Text: \"\"\" " + request.args.get('requirement') + " \"\"\" "
        model="text-davinci-003"
        numberofOutputs=1
        maxTokens=500

    if TestCaseType == 'UIUCTC':
        requirement =  "Write 30 UI and UX test cases for the following. " + "Text: \"\"\" " + request.args.get('requirement') + " \"\"\" "
        model="text-davinci-003"
        numberofOutputs=1
        maxTokens=500

    if TestCaseType == 'MCUI':
        requirement =  "Write 10 Most common user inputs for the following. " + "Text: \"\"\" " + request.args.get('requirement') + " \"\"\" "
        model="text-davinci-003"
        numberofOutputs=1
        maxTokens=500
        
    if TestCaseType == 'PRE':
        requirement =  "Write 10 preconditions for the following requirement. " + "Text: \"\"\" " + request.args.get('requirement') + " \"\"\" "
        model="text-davinci-003"
        numberofOutputs=1
        maxTokens=500

    if TestCaseType == 'SBREAK':
        requirement =  "Write 10 Scenarios where this feature might break. " + "Text: \"\"\" " + request.args.get('requirement') + " \"\"\" "
        model="text-davinci-003"
        numberofOutputs=1
        maxTokens=500

    if TestCaseType == 'UNEXPECTED':
        requirement =  "What are 10 unexpected ways that users might use this feature? " + "Text: \"\"\" " + request.args.get('requirement') + " \"\"\" "
        model="text-davinci-003"
        numberofOutputs=1
        maxTokens=500

    if TestCaseType == 'BUG':
        requirement =  "Write a bug report for a defect. " + "Text: \"\"\" " + request.args.get('requirement') + " \"\"\" "
        model="text-davinci-003"
        numberofOutputs=1
        maxTokens=500   
    # else:
    #       requirement =  "Write 30 test cases for the following. " + "Text: \"\"\" " + request.args.get('requirement') + " \"\"\" "


    outputTestCases = openai.Completion.create(
    model=model,
    prompt=requirement,
    temperature=temperature,
    max_tokens=maxTokens,
    top_p=1,
    frequency_penalty=0.5,
    presence_penalty=0.5,
    n=numberofOutputs,
    stop=[" END"]
    )
    
    print(requirement)
    print(outputTestCases)
    return outputTestCases



#The content filter flags text that may violate our content policy. It's powered by our moderation endpoint which is free to use to moderate your OpenAI API traffic. 

@app.route('/moderateContent',methods = ['POST','GET'])
def contentModeration():

    requirement = request.args.get('requirement')

    isRequestBad = openai.Moderation.create(
    input= requirement
    )
    # print (isContentOk)
    return isRequestBad


if __name__ == '__main__':
    app.run(debug=True)
    


# stripe 

# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
stripe.api_key = 'sk_test_51MGzagSEETzMR7U3gjZVFl0mRh2ukuClZwu3ORfKMi8YdjLkwIvM007YtPUpFqWb2sxYZPqnZy9p0aCiavWZ8RDh00ZTIfcSCq'

# prod
# stripe.api_key = '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'


@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    customer_email = request.form.get('customer_email')
    product_Id = request.form.get('product_Id')
    quantity = 1
    # domain_url = os.getenv('DOMAIN')
    domain_url = 'http://127.0.0.1:5000'
    # domain_url = 'https://testera.club'

    try:
        checkout_session = stripe.checkout.Session.create(
            success_url=domain_url + '/Account?session_id={CHECKOUT_SESSION_ID}',
            cancel_url=domain_url + '/Account',
            mode='payment',
            customer_email=customer_email,
            line_items=[{
                'price': product_Id,
                'quantity': quantity,
            }]
        )
        return redirect(checkout_session.url, code=303)
    except Exception as e:
        return jsonify(error=str(e)), 403


# Fetch the Checkout Session to display the payment status on home page after payment
@app.route('/checkout-session', methods=['GET'])
def get_checkout_session():
    id = request.args.get('sessionId')
    checkout_session = stripe.checkout.Session.retrieve(id)
    return jsonify(checkout_session)


# stripe listen --forward-to http://127.0.0.1:5000/webhook
# stripe trigger checkout.session.completed

@app.route('/webhook', methods=['POST'])
def webhook_received():

    webhook_secret = 'whsec_00691070098ba2d2ef5eef52ea01ab73134236f297f5ab3aa59833caf453b022'

    # prod
    # webhook_secret = 'whsec_DPLjrF2FZYJzednbzYyn4PNLmASMlvLw'


    request_data = json.loads(request.data)

    if webhook_secret:
        # Retrieve the event by verifying the signature using the raw body and secret if webhook signing is configured.
        signature = request.headers.get('stripe-signature')
        try:
            event = stripe.Webhook.construct_event(
                payload=request.data, sig_header=signature, secret=webhook_secret)
            data = event['data']
        except Exception as e:
            return e
        # Get the type of webhook event sent - used to check the status of PaymentIntents.
        event_type = event['type']
    else:
        data = request_data['data']
        event_type = request_data['type']
    data_object = data['object']

    if event_type == 'checkout.session.completed':

        PaymentData = data.to_dict()
        customer_emailSentByTestEra=PaymentData['object']['customer_email']
        amount_total=PaymentData['object']['amount_total']
        # email=PaymentData['object']['customer_details']['email']
        id=PaymentData['object']['id']
        payment_status=PaymentData['object']['payment_status']
        status=PaymentData['object']['status']
        currency=PaymentData['object']['currency']



        #first  pip3 install firebase_admin
        if not firebase_admin._apps:
            cred = credentials.Certificate("admininfoforfirebase.json")
            firebase_admin.initialize_app(cred, {
                'databaseURL': 'https://testera-club-default-rtdb.firebaseio.com/'
            })

        ref = db.reference('myCredits/')
        userinfo = ref.order_by_child("user_Email").equal_to(customer_emailSentByTestEra).limit_to_first(1).get()
        
        dict_values = list(userinfo.values())

        # get the user id of the email from db to add credits 
        userIdToUpdate = dict_values[0]['userId']
        creditsPurchased = 0

        if 25000 <= amount_total <= 35000:
            creditsPurchased = 100

        if 55000 <= amount_total <= 65000:   
            creditsPurchased = 210
        
        if 250000 <= amount_total <= 350000:  
            creditsPurchased = 1000    

        
        creditstoadd = dict_values[0]['creditsRemaining'] + creditsPurchased

        # add credits to the account
        ref.child(userIdToUpdate).update({"creditsRemaining": creditstoadd})

        # update the log of credits
        currenttime = time.time()

        ref2 = db.reference('myCreditsKaLog/')
        data = {"createdDate": currenttime, "creditMessage":"Payment of " +currency + " " +str(amount_total) +" payment_status --"+payment_status + " order status --"+status, "creditsCredited": creditsPurchased ,"creditsDebited":0 ,"userId": userIdToUpdate}
        ref2.push(data)

        # update revenue table
        ref3 = db.reference('RevenueLog/')
        data = {"createdDate": currenttime, " currency ": currency ,"amount_total":amount_total,"userId": userIdToUpdate, "creditsPurchased": creditsPurchased, "StripePaymentID": id}
        ref3.push(data)

    return jsonify({'status': 'success'})

