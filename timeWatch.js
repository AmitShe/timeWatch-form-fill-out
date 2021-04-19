const puppeteer = require('puppeteer')
const dotenv = require('dotenv')
dotenv.config()

const COMPANY_NUMBER_SELECTOR = '[id=compKeyboard]'
const EMPLOYEE_NUMBER_SELECTOR = '[id=nameKeyboard]'
const PASSWORD_SELECTOR = '[id=pwKeyboard]'

const LOGIN_SELECTOR = '[name=B1]'

const START_MINUTE = '[id=emm0]'
const START_HOUR = '[id=ehh0]'
const END_MINUTE = '[id=xmm0]'
const END_HOUR = '[id=xhh0]'

const UPDATE_SELECTOR = 'body > div > span > table:nth-child(3) > tbody > tr:nth-child(1) > td:nth-child(2) > form > div > div > table > tbody > tr:nth-child(2) > td:nth-child(2) > font > a > b'

const TIMEWATCH_URL = 'https://checkin.timewatch.co.il/punch/punch.php'

async function main() {
  browser = await puppeteer.launch({
    headless: false,
  })
  page = await browser.newPage()
  await page.goto(TIMEWATCH_URL, { waitUntil: 'load' })
  await page.type(COMPANY_NUMBER_SELECTOR, process.env.companyNumber)
  await page.type(EMPLOYEE_NUMBER_SELECTOR, process.env.employeeNumber)
  await page.type(PASSWORD_SELECTOR, process.env.password)
  await page.click(LOGIN_SELECTOR)
  await page.waitForNavigation({ waitUntil: 'networkidle0' })
  await page.click(UPDATE_SELECTOR)
  await page.waitForTimeout(2000);

  const daysToFill = await page.$$('[bgcolor="red"]')
  for (var i = 0; i < daysToFill.length; i++) {
    const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));
    const dayToFill = await page.$('[bgcolor="red"]')
    await dayToFill.click()
    await page.waitForTimeout(1000);

    const popup = await newPagePromise;
    await popup.waitForTimeout(1000);
    await popup.type(START_MINUTE, '00')
    await popup.type(START_HOUR, '09')
    await popup.type(END_MINUTE, '00')
    await popup.type(END_HOUR, '18')
    await popup.click(LOGIN_SELECTOR)
    await page.waitForTimeout(1000);
  }

  await browser.close();

}

main();
