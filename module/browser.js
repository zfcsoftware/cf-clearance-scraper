
const main = async ({
    proxy = {},
    agent = null
}) => {
    try {
        const { connect } = await import('puppeteer-real-browser')

        const { browser, page } = await connect({
            turnstile: true,
            proxy
        })

        if (proxy && proxy.username && proxy.password) await page.authenticate({ username: proxy.username, password: proxy.password });

        if (agent) await page.setUserAgent(agent);

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