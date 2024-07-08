const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
var Xvfb = require('xvfb');

const checkStat = ({ page }) => {
    return new Promise(async (resolve, reject) => {

        var st = setTimeout(() => {
            clearInterval(st)
            resolve(false)
        }, 4000);
        try {
            const elements = await page.$$('.cf-turnstile-wrapper');
            if (elements.length <= 0) return resolve(false);
            for (const element of elements) {
                try {
                    const box = await element.boundingBox();

                    const x = box.x + box.width / 2;
                    const y = box.y + box.height / 2;

                    await page.mouse.click(x, y);
                } catch (err) { }
            }
            clearInterval(st)
            resolve(true)
        } catch (err) {
            // console.log(err);
            clearInterval(st)
            resolve(false)
        }
    })
}




const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const main = async ({
    proxy = {},
    agent = null
}) => {
    try {
        var solve_status = true

        const setSolveStatus = ({ status }) => {
            solve_status = status
        }


        const autoSolve = ({ page }) => {
            return new Promise(async (resolve, reject) => {
                while (solve_status) {
                    try {
                        await sleep(1500)
                        await checkStat({ page: page }).catch(err => { })
                    } catch (err) { }
                }
                resolve()
            })
        }

        setSolveStatus({ status: true })


        try {
            var xvfbsession = new Xvfb({
                silent: true,
                xvfb_args: ['-screen', '0', '1920x1080x24', '-ac']
            });
            xvfbsession.startSync();
        } catch (err) { }


        const browser = await puppeteer.launch({
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                (proxy && proxy.host && proxy.port) ? `--proxy-server=${proxy.host}:${proxy.port}` : "",
                "--window-size=1920,1080"
            ],
            defaultViewport: {
                width: 1920,
                height: 1080
            },
            ignoreHTTPSErrors: true,
            targetFilter: target => !!target.url(),
        });

        var page = await browser.pages();
        page = page[0];

        if (proxy.username && proxy.password) await page.authenticate({ username: proxy.username, password: proxy.password });

        if (agent) await page.setUserAgent(agent);

        browser.on('disconnected', async () => {
            try { xvfbsession.stopSync(); } catch (err) { }
            try { setSolveStatus({ status: false }) } catch (err) { }
        });
        autoSolve({ page: page, browser: browser })
        return {
            page,
            browser
        }
    } catch (err) {
        console.log(err.message);
        return false
    }
}
module.exports = main;