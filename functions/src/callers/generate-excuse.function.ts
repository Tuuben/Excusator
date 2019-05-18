import * as functions from 'firebase-functions';
import { getGeneratedSentance } from './generate-sentance';
import axios from 'axios';
import { scrapeImagesForURL } from './image-scraper';
import { getDiscountCode } from './discount-code';


export const generateExcuse = functions
.region('europe-west1')
.runWith({memory: '1GB'})
.https.onRequest(async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');

    const { response_url, user_name, time, formalMeeting } = request.body;
    
    const excuseSentanceData = await getGeneratedSentance(time, user_name, formalMeeting);

    console.log('exuce done ...');

    const { text, searchQuery } = excuseSentanceData;

    const image_url = await scrapeImagesForURL(searchQuery || '');

    console.log('img gottten !');

    const discount = await getDiscountCode();

    try{
        await axios.post(
            response_url,
            { 
                response_type: "in_channel", 
                text,
                attachments: [
                    {
                        title: 'Here da proof 👇',
                        image_url
                    },
                    {
                        title: 'Anyways, sorry! Here is a discount code',
                        title_link: discount.url,
                        text: `CODE:${discount.code || '123'} to ${discount.store}`
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