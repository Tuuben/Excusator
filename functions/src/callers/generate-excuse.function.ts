import * as functions from 'firebase-functions';
import { getGeneratedSentance } from './generate-sentance';
import axios from 'axios';
import { scrapeImagesForURL } from './image-scraper';


export const generateExcuse = functions.https.onRequest(async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');

    const { response_url, time } = request.body;
    
    const excuseSentanceData = await getGeneratedSentance(time);

    const { text, searchQuery } = excuseSentanceData;

    const image_url = await scrapeImagesForURL(searchQuery || '');

    try{
        await axios.post(
            response_url,
            { 
                response_type: "in_channel", 
                text,
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

    response.send(text);
});