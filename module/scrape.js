const browserCreator = require('./browser');


function checkTimeOut(startTime, endTime = new Date().getTime()) {
    return (endTime - startTime) > global.timeOut
}


const scrape = async ({ proxy = {},
    agent = null,
    url = 'https://nopecha.com/demo/cloudflare',
    defaultCookies = false
}) => {
    return new Promise(async (resolve, reject) => {
        global.browserLength++
        var brw = null,
            startTime = new Date().getTime()
        try {
            setTimeout(() => {
                global.browserLength--
                try { brw.close() } catch (err) { }
                return resolve({ code: 500, message: 'Request Timeout' })
            }, global.timeOut);
            var { page, browser } = await browserCreator({ proxy, agent })

            brw = browser

            try { if (defaultCookies) await page.setCookie(...defaultCookies) } catch (err) { }

            await page.goto(url, {
                waitUntil: ['load', 'networkidle0']
            })

            var cookies = false

            while (!cookies) {
                try {
                    cookies = await page.cookies()
                    if (!cookies.find(cookie => cookie.name === 'cf_clearance')) cookies = false
                } catch (err) { cookies = false }
                await new Promise(resolve => setTimeout(resolve, 50))
                if (checkTimeOut(startTime)) {
                    await browser.close()
                    global.browserLength--
                    return resolve({ code: 500, message: 'Request Timeout' })
                }
            }

            if (!agent) agent = await page.evaluate(() => navigator.userAgent);

            await browser.close()
            global.browserLength--

            return resolve({ code: 200, cookies, agent, proxy, url })

        } catch (err) {
            global.browserLength--
            try { brw.close() } catch (err) { }
            return resolve({ code: 500, message: err.message })
        }
    })
}


module.exports = scrape;