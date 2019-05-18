import axios from 'axios';

export async function getDiscountCode() {
    const now = new Date();
    const pastTenDays = now.setDate( now.getDate() - 10 )
    const res = await axios.get(`http://feed.linkmydeals.com/getOffers/?API_KEY=82748951bfa9d803d6e2be8661f2f9ff&format=json&last_extract_datetime=${ new Date(pastTenDays) }`);

    if(!res || !res.data || !res.data.results){
        console.log('res ', res.data);
        return {};
    }

    const randomIndex = Math.floor( Math.random() * (res.data.offers.length - 1) )
    const randomDiscount = res && res.data && res.data.offers[randomIndex];

    return randomDiscount;
}