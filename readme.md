# New Hampshire Secretary of State and Cobalt Intelligence Secretary of State API

This packages shows an example of how to get [New Hampshire Secretary of State](https://quickstart.sos.nh.gov/online/BusinessInquire) and use things like [Cobalt Intelligence Secretary of State API](https://cobaltintelligence.com/secretary-of-state) to get some really interesting business data. You can target specific keywords and even industries and get phone numbers and email addresses for these businesses.

## Getting Started

Clone the repository and run `npm i`.

You will need a Cobalt Intelligence API key from [here](https://cobaltintelligence.com/secretary-of-state).

Once you have the API key, you'll want to replace the dummy values in the `.sample.env` file and rename it to `.env`.

[Full Guide](https://cobaltintelligence.com/blog/getting-interesting-business-data-nh-and-sos-api/)

### Prerequisites

Tested on Node v14.17.5 and NPM v6.14.14.

### Installing

After installing [NodeJS](https://nodejs.org/en/) you should be able to just run the following in the terminal.

```
npm i
```

## Built With

* [cobalt-int-sdk](https://github.com/cobalt-intelligence/cobalt-int-sdk) - SDK for Cobalt Intelligence's SOS API
* [csvtojson](https://github.com/Keyang/node-csvtojson) - Converts CSVs to JSON
* [axios](https://axios-http.com/docs/intro) - HTTP request library
* [puppeteer](https://github.com/puppeteer/puppeteer) - Headless browser
* [dotenv](https://github.com/motdotla/dotenv) - Allows use of environment variables
* [json2csv](https://github.com/zemirco/json2csv) - Converts JSON to CSVs
* [NodeJS](https://nodejs.org/en/) - NodeJS

## Authors

* **Jordan Hansen** - *Initial work* - [Jordan Hansen](https://github.com/aarmora)


## License

This project is licensed under the ISC License
