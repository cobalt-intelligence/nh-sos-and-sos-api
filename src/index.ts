import puppeteer from 'puppeteer';
import * as json2csv from 'json2csv';
import * as fs from 'fs';
import { IBusiness } from 'cobalt-int-common';
import { SosApi } from 'cobalt-int-sdk';
import csvtojson from 'csvtojson';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
    const fileName = 'Businesses from New Hampshire.csv';

    // Run this first to get the list of all NH businesses
    await getAllBusinesses(fileName);

    // Then run this to get the business data from the businesses, including emails and phone numbers
    // await getBusinessDetails(fileName);

})();

async function getAllBusinesses(fileName: string) {
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();
    await page.goto('https://quickstart.sos.nh.gov/online/BusinessInquire');

    console.log('Waiting 30 seconds while captcha and other business data is entered.');
    // During this time you need to enter the captcha and select what you are searching for
    await page.waitForSelector('#xhtml_grid', { timeout: 30000 });

    const businesses: any[] = [];

    for (let i = 0; i < 2; i++) {    
        await page.type('#txtCommonPageNo', (i + 1).toString());
        await page.click('#lkGoPage');

        await page.waitForTimeout(10000);

        await handlePage(page, businesses);
        console.log('Total db ids', businesses.length);
    }

    await browser.close();

    const csv = json2csv.parse(businesses);
    fs.writeFileSync(fileName, csv);

    console.log('Businesses', businesses);
}

async function handlePage(page: puppeteer.Page, businesses: any[]) {
    const rows = await page.$$('#xhtml_grid tbody tr');

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const status = (await row.$eval('td:nth-of-type(8)', element => element.textContent)).trim();
        const dbId = ((await row.$eval('a', element => element.getAttribute('href'))).split('businessID='))[1].trim();
        const title = (await row.$eval('td:nth-of-type(1)', element => element.textContent)).trim();

        console.log('dbId', dbId);
        if (status === 'Active' || status === 'Good Standing') {
            const foundDbId = businesses.find(aDbId => aDbId.dbId === dbId);

            if (!foundDbId) {
                businesses.push({
                    dbId: dbId,
                    title: title,
                    status: status
                });
            }
        }
    }
}

async function getBusinessDetails(fileName: string) {
    const businesses = await csvtojson().fromFile(fileName);

    console.log('Businesses length', businesses.length);

    const fullBusinesses: any[] = [];
    const sosApi = new SosApi(process.env.cobaltIntApiKey);

    for (let i = 0; i < businesses.length; i++) {
        const business = businesses[i];
        let fullBusinessResponse: IBusiness[];

        try {
            fullBusinessResponse = await sosApi.getBusinessDetails(business.title, 'nh');
        }
        catch (e) {
            console.log('Some error happened while getting business data', e);
            continue;
        }
        const fullBusiness = fullBusinessResponse[0];

        console.log('Full business', fullBusiness, 'originalBusinessId', business.title);

        if (fullBusiness.email && fullBusiness.email.toLocaleLowerCase() !== 'none') {
            fullBusinesses.push(fullBusiness)
        }
    }

    console.log('total full businesses found', fullBusinesses.length);

    const csv = json2csv.parse(fullBusinesses);

    fs.writeFileSync('Full business information found.csv', csv);
}
