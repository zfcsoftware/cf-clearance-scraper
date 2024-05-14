# CF Clearance Scraper

This package provides an api that returns cookies (cf-clearance) that you can request on a website protected by Cloudflare WAF (corporate or normal) without being blocked by WAF.

When checking your requests, Cloudflare does not only check the Cookie. It also checks IP and User Agent. For this reason, you should send your requests by setting User Agent, IP and Cookie.

Cookies with cf in the name belong to Cloudflare. You can find out what these cookies do and how long they are valid by **[Clicking Here](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/)**.

## Installation

Installation with Docker is recommended.

**Docker**

```bash

docker run -d -p 3000:3000 \
-e PORT=3000 \
-e browserLimit=20 \
-e timeOut=30000 \
zfcsoftware/cf-clearance-scraper

```
**Github**

```bash
git clone https://github.com/zfcsoftware/cf-clearance-scraper
cd cf-clearance-scraper
npm install
npm run start
```

## Usage

It is not recommended to change the user agent information. You will be returned the User Agent information used when scraping.

```js
    fetch('http://localhost:3000/cf-clearance-scraper', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // authToken: 'test', // Not mandatory. Checked if the env variable is set.
            url: 'https://nopecha.com/demo/cloudflare', // Link to engrave
            // agent: null,
            // defaultCookies: [],
            // Proxy information (not mandatory)
            // proxy: {
            //     host: '1.1.1.1',
            //     port: '1111',
            //     username: 'test',
            //     password: 'test'
            // }
        })
    }).then(res => res.json()).then(console.log).catch(console.error)
```

**Variables**

*Request Body*

**authToken** If set to env, it is checked to keep the API secure. If it is not set to private, it does not need to be sent.

**url** Refers to the URL address to be scraped. You must send the exact link where you are stuck in WAF. If WAF does not exit, if the site uses Cloudflare, it will still successfully return the relevant Cookie.

**agent** Allows you to change your User Agent information. It is not recommended to change it. Using the default is safe and guaranteed. The default User Agent information is returned at the end of the request.

**proxy** Host, Port, Username and Password information is sent by the Proxy you send. Sending is not mandatory.

**defaultCookies** Puppeteer allows you to use your pre-existing cookies. If you send the cookies you received with page.cookies, it starts the process with them.

*ENV*

**browserLimit** Allows you to set the maximum number of browsers that can be opened at the same time. The default is 20. If exceeded, api will return error code 429.

**timeOut** Sets the maximum time a transaction will take. The default is 30000. Must be given in milliseconds.

**authToken** Not mandatory. If not set, all requests are allowed. If set, the request must be sent with the authToken variable in the request body.

**PORT** The default is 3000. It is not recommended to change it.

Sample Response

```js
    {
        "code": 200,
        "cookies": [
            {
                "name": "cf_clearance",
                "value": "pwmJ7kRHD41XrsEasuBMrLDwmSr7qcacgxwIhHVpKWY-1715642133-1.0.1.1-go3FxcDfJdvUqz.aWX03tQL9Z_duip.S0hSVnno4U94Xj.cfczNEpjMM5F5azfIxg5capVQJXX_sc7YJ8Qvj0w",
                "domain": ".nopecha.com",
                "path": "/",
                "expires": 1747178137.666717,
                "size": 161,
                "httpOnly": true,
                "secure": true,
                "session": false,
                "sameSite": "None",
                "priority": "Medium",
                "sameParty": false,
                "sourceScheme": "Secure",
                "partitionKey": "https://nopecha.com"
            }
        ],
        "agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "proxy": {},
        "url": "https://nopecha.com/demo/cloudflare"
    }
```

## Support us

Please star the repo to help this open source project get updates. Your star will help us a lot.

## Disclaimer of Liability

This library has been created for testing and educational purposes. The user is responsible for any problems that may arise. You can start a discussion for any problems you are experiencing, but you should avoid messages that will disturb or force the developer. This project is completely open source. Please support it with a star rating.
