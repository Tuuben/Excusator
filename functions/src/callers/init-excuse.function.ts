import * as functions from 'firebase-functions';
import axios from 'axios';


export const initExcuse = functions
.region('europe-west1')
.https.onRequest(async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');

    const { response_url, text } = request.body;

    const time = parseInt(text);

    axios.post(
        'https://us-central1-excusator-6c44b.cloudfunctions.net/generateExcuse',
        { response_url, time }, 
        { responseType: 'application/json'}
    )
    .catch(console.error)


    response.statusCode = 200;
    response.send(`Ta-ta generating response... Don't be afraid, it might take a minute 🧙`)
});