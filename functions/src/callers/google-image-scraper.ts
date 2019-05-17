import * as puppeteer from 'puppeteer';

export async function scrapeGoogleImagesForURL(searchQuery: string){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://google.com');
    await page.focus('.gLFyf');
    await page.keyboard.type(searchQuery);
    await page.keyboard.press('Enter');
    await page.waitForNavigation({waitUntil: 'networkidle0'});
    await page.click('#hdtb-msb div .hdtb-msb-vis div:nth-child(2) a')
    //etc

    return 'https://www.meme-arsenal.com/memes/aa6292e99c975dad9f783870457e822b.jpg';
}