import * as functions from 'firebase-functions';
import axios from 'axios';


export const initExcuse = functions
.region('europe-west1')
.https.onRequest(async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');

    const { response_url, user_name, text } = request.body;

    const args = text.split(' ');
    const time = parseInt(args[0]);
    const formalMeeting = !!args[1];  

    console.log('time', time, 'formal', formalMeeting)

    axios.post(
        'https://europe-west1-excusator-6c44b.cloudfunctions.net/generateExcuse',
        { response_url, user_name, time, formalMeeting }, 
        { responseType: 'application/json'}
    )
    .catch(console.error)


    response.statusCode = 200;
    response.send(`Ta-ta generating response... Don't be afraid, it might take a minute 🧙`)
});