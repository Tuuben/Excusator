import * as puppeteer from 'puppeteer-core';

export async function scrapeImagesForURL(searchQuery: string){
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto('https://images.search.yahoo.com/');
    
    await page.focus('#yschsp');
    
    await page.keyboard.type('cat expldoing');
      
    await page.keyboard.press('Enter');
    
    await page.waitForNavigation({waitUntil: 'networkidle0'});
    
    const element = await page.$('#sres li:nth-child(1) a img') as any;
    
    const src = await (await element.getProperty('src')).jsonValue();
    
    console.log( src);
    await page.screenshot({path: 'screenshot.png'});
    
    await browser.close();
    
    return src;
}