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

    const { response_url, user_name, time, formalMeeting } = request.body;
    
    const excuseSentanceData = await getGeneratedSentance(time, user_name, formalMeeting);

    const { text, searchQuery } = excuseSentanceData;

    const image_url = await scrapeImagesForURL(searchQuery || '');

    const discount = await getDiscountCode();

    const discountAttachment = {
        title: 'Anyways, sorry! Here is a discount code to make up for all this trouble!',
        title_link: discount.url,
        text: `CODE:${discount.code || '123'} to ${discount.store || 'Teboil'}`
    }

    const noDiscount = {
        title: `Anyways sorry! I would've given you a discount but our max api calls for the day has exceeded, so f*ck off.`
    }

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
                    discount && discount.code ? discountAttachment : noDiscount
                ]
            }, 
            { responseType: 'application/json' }
        )
    } catch(err) {
        console.error(err);
    }

    response.send(text);
});