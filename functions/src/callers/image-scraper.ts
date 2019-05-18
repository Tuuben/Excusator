import * as puppeteer from 'puppeteer';
import * as admin from 'firebase-admin';

interface QueryImage{
    imageURL?: string
}

async function getCachedImage(searchQuery: string) { 
    const id = searchQuery.toLowerCase().replace(/\s/g, '');

    const ref = await admin
    .firestore()
    .collection('queryImages')
    .doc(id);

    const snapshot = await ref.get();

    if(!snapshot || !snapshot.data()){
        return {};
    }

    const image = snapshot.data() as QueryImage;

    return image || {};
}  

async function cacheImage(query: string, imageURL: string){
    const id = query.trim().toLowerCase().replace(/\s/g,'');

    const data: QueryImage = {
        imageURL
    }   

    await admin
    .firestore()
    .collection('queryImages')
    .doc(id)
    .set(data);
}


export async function scrapeImagesForURL(searchQuery: string){
    const cachedImage = await getCachedImage(searchQuery);

    if(!!cacheImage && cachedImage.imageURL){
        return cachedImage && cachedImage.imageURL;
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    await page.goto('https://images.search.yahoo.com/');
    
    await page.focus('#yschsp');
    
    await page.keyboard.type(searchQuery);
      
    await page.keyboard.press('Enter');
    
    await page.waitForNavigation({waitUntil: 'networkidle0'});
    
    const element = await page.$('#sres li:nth-child(1) a img') as any;
    
    const src = await (await element.getProperty('src')).jsonValue();
    
    await browser.close();

    await cacheImage(searchQuery, src);
    
    return src;
}