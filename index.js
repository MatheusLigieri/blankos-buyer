const puppeteer = require('puppeteer');
const config = require('./config/configurator.json')
init()
async function init() {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 0, // slow down by 250ms
        args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process']
    });
    login(browser)

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function login(browser) {
    const login = await browser.newPage({
        waitUntil: 'domcontentloaded'
    });
    await login.setViewport({
        width: 1366, height: 768,
        deviceScaleFactor: 1,
    });
    await login.goto('https://accounts.mythical.games/realms/mythical/protocol/openid-connect/auth?client_id=blankos-dot-com-prod&redirect_uri=https%3A%2F%2Fblankos.com%2F&state=986cef6d-6cc2-47c3-bca2-18002d599871&response_mode=fragment&response_type=code&scope=openid&nonce=515fc964-1ee8-42c9-8fd2-93c805da0625');
    let selectorEmail = '#username'
    let selectorPass = '#password'
    await login.waitForSelector(selectorEmail, { visible: true, timeout: 0 })
    await login.click(selectorEmail)
    await login.waitForSelector(selectorPass, { visible: true, timeout: 0 })
    await login.click(selectorPass)
    await login.type(selectorPass, config.authentication.user)
    await login.type(selectorEmail, config.authentication.pass)
    await login.waitForTimeout(500)
    await login.evaluate(function () {
        var links = document.querySelector('.btn.btn-primary.btn-block.btn-lg');
        links.click()
    })
    await sleep(500)
    shopPage(browser)
}

async function shopPage(browser) {
    const shopPage = await browser.newPage({
        waitUntil: 'domcontentloaded'
    });
    await shopPage.setViewport({
        width: 1366, height: 768,
        deviceScaleFactor: 1,
    });
    await shopPage.goto('https://blankos.com/shop');
    await sleep(500)
    await shopPage.evaluate(function () {
        var h6 = document.querySelectorAll('h6');
        h6.forEach(function (item) {
            if (item.textContent.toLowerCase() == "green bandana".toLowerCase()) {
                var pai = item.parentNode
                pai = pai.parentNode
                pai = pai.parentNode
                pai.click()
            }
        })
    })
    await sleep(500)
    await shopPage.evaluate(function () {
        var h6 = document.querySelectorAll('span.MuiButton-label');
        h6[5].click()
    })
    sleep(2000)
    checkoutPage(browser)

}

async function checkoutPage(browser){
    const checkoutPage = await browser.newPage({
        waitUntil: 'domcontentloaded'
    });
    await checkoutPage.setViewport({
        width: 1366, height: 768,
        deviceScaleFactor: 1,
    });
    await checkoutPage.goto('https://blankos.com/checkout');
    await sleep(500)
    await checkoutPage.evaluate(function () {
        document.querySelector('[name=terms]').click()
    })
    await checkoutPage.waitForSelector("#firstName", { visible: true, timeout: 0 })
    await checkoutPage.type("#firstName", "Matheus")
    await checkoutPage.waitForSelector("#lastName", { visible: true, timeout: 0 })
    await checkoutPage.type("#lastName", "Ligieri")
    await checkoutPage.waitForSelector("#country", { visible: true, timeout: 0 })
    await checkoutPage.type("#country", config.adressData.country)
    await checkoutPage.keyboard.press('Enter');
    await checkoutPage.waitForSelector("#addressLine1", { visible: true, timeout: 0 })
    await checkoutPage.type("#addressLine1", config.adressData.street)
    await checkoutPage.waitForSelector("#city", { visible: true, timeout: 0 })
    await checkoutPage.type("#city", config.adressData.city)
    await checkoutPage.waitForSelector('input[id^="state"]', { visible: true, timeout: 0 })
    await checkoutPage.type('input[id^="state"]', config.adressData.state)
    await checkoutPage.waitForSelector("#postalCode", { visible: true, timeout: 0 })
    await checkoutPage.type("#postalCode", config.adressData.postalCode)
    await checkoutPage.click('.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedSecondary');
    await checkoutPage.waitForSelector(".MuiBox-root.jss78 .MuiButtonBase-root.MuiButton-root.MuiButton-text", { visible: true, timeout: 0 })
    await checkoutPage.click('.MuiBox-root.jss78 .MuiButtonBase-root.MuiButton-root.MuiButton-text');
    await checkoutPage.click('.MuiButtonBase-root.MuiButton-root.MuiButton-contained.jss16.MuiButton-containedSizeLarge.MuiButton-sizeLarge.MuiButton-fullWidth');
}