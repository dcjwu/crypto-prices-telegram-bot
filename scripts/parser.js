const axios = require('axios')
const cheerio = require('cheerio')

const parsePrice = async (urlParse, selector = process.env.SELECTOR) => {
    const getHTML = async (url) => {
        const {data} = await axios.get(url)
        return cheerio.load(data)
    }
    const $ = (await getHTML(urlParse))
    const selectorHtml = $(selector).text()
    return selectorHtml
}

module.exports = parsePrice

