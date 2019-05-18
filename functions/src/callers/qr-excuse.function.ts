import * as functions from 'firebase-functions';
import axios from 'axios';
import { getGeneratedSentance } from './generate-sentance';
import { scrapeImagesForURL } from './image-scraper';


export const qrExcuse = functions
.region('europe-west1')
.https.onRequest(async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');

    const lateMessage = await getGeneratedSentance(5);

    const image_url = await scrapeImagesForURL(lateMessage.searchQuery || '');

    axios.post(
        'https://hooks.slack.com/services/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',
        {
            text: lateMessage.text,
            attachments: [
                {
                    title: 'Here da proof 👇',
                    image_url
                }
            ]
        }, 
        { responseType: 'application/json'}
    )
    .catch(console.error) 

    response.statusCode = 200;
    response.send(`excused.`)
}); 