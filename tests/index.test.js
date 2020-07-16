const {describe, test, expect, beforeEach, afterEach} = require("@jest/globals");
const puppeteer = require('puppeteer');
const { host, username, password } = require('./config');

describe('Test suite', () => {
  let browser,
      page;

  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  })

  test(`Проверка авторизации на ${host}`, async () => {
    await page.goto(host);
    await page.click('li#pt-login');
    await page.waitForSelector('input#wpName1');
    await page.click('input#wpName1');
    await page.type('input#wpName1', username);
    await page.click('input#wpPassword1');
    await page.type('input#wpPassword1', password);
    await page.click('input#wpRemember');
    await page.click('button#wpLoginAttempt');

    await page.waitForSelector('li#pt-userpage a');
    const login = await page.$eval('li#pt-userpage a', login => login.textContent);

    expect(login).toBe(username);
  });

  test(`Проверка поиска`, async () => {
    const searchingWord = 'Соединённые Штаты Америки';

    await page.goto(host);
    await page.waitForSelector('input#searchInput');
    await page.click('input#searchInput');
    await page.type('input#searchInput', searchingWord);
    await (await page.$('input#searchInput')).press('Enter');
    await page.waitForSelector('ul.mw-search-results');
    await page.click(`a[title="${searchingWord}"]`)

    await page.waitForSelector('h1#firstHeading');
    const header = await page.$eval('h1#firstHeading', header => header.textContent);
    const title = await page.title();
    await page.screenshot({path: 'screenshot.png'});

    expect(title).toMatch(searchingWord);
    expect(header).toBe(searchingWord);
  });

  afterEach(async () => {
    await browser.close();
  })
})
