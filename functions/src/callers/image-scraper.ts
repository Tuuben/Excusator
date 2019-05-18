import * as puppeteer from 'puppeteer';
import * as admin from 'firebase-admin';

interface QueryImage{
    query?: string;
    imageURL?: string
}

async function getCachedImage(searchQuery: string) { 
    const query = await admin
    .firestore()
    .collection('queryImages')
    .where('query', '==', searchQuery)
    .limit(1);  

    const snapshot = await query.get();

    if(snapshot.empty){
        return {};
    }

    const image = snapshot.docs[0] as QueryImage;

    return image || {};
}  

async function cacheImage(query: string, imageURL: string){
    const data: QueryImage = {
        query,
        imageURL
    }   

    await admin
    .firestore()
    .collection('queryImages')
    .add(data);
}


export async function scrapeImagesForURL(searchQuery: string){
    const cachedImage = await getCachedImage(searchQuery);
    console.log('my cached image ', cachedImage);
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