import * as functions from 'firebase-functions';
import { getGeneratedSentance } from './generate-sentance';
import axios from 'axios';
import { scrapeGoogleImagesForURL } from './google-image-scraper';


export const generateExcuse = functions.https.onRequest(async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');

    const { response_url, time } = request.body;
    
    const excuseSentance = await getGeneratedSentance(time);

    const image_url = await scrapeGoogleImagesForURL('retarded cat');

    try{
        await axios.post(
            response_url,
            { 
                response_type: "in_channel", 
                text: excuseSentance,
                attachments: [
                    {
                        title: 'Related picture 👇',
                        image_url
                    }
                ]
            }, 
            { responseType: 'application/json' }
        )
    } catch(err) {
        console.error(err);
    }

    response.send(excuseSentance);
});