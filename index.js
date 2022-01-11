require('dotenv').config()
const TelegramApi = require('node-telegram-bot-api')
const updateDb = require('./db/updateDb')
const getDataDb = require('./db/getDataDb')
const convertToUsd = require('./scripts/convertToUsd')

const token = process.env.TGBOT_KEY
const bot = new TelegramApi(token, {polling: true})

const getPrices = async () => {
    const callMap = new Map([
            [process.env.BTC, [process.env.BTC_HTML, '', '']],
            [process.env.DOGE, [process.env.DOGE_HTML, process.env.DOGE_CRY, process.env.DOGE_FIAT]],
            [process.env.BNB, [process.env.BNB_HTML, '', '']],
            [process.env.MANA, [process.env.MANA_HTML, '', '']],
            [process.env.ADA, [process.env.ADA_HTML, '', '']],
            [process.env.LINK, [process.env.LINK_HTML, '', '']],
            [process.env.SOL, [process.env.SOL_HTML, '', '']],
            [process.env.DOT, [process.env.DOT_HTML, '', '']],
            [process.env.MATIC, [process.env.MATIC_HTML, '', '']],
            [process.env.XRP, [process.env.XRP_HTML, '', '']],
            [process.env.ETH, [process.env.ETH_HTML, '', '']]
        ])
    for (let pair of callMap) {
        await updateDb(...pair)
    }
}

const start = async () => {
    await bot.setMyCommands([
        {command: '/start', description: 'Welcome message.'},
        {command: '/check_price', description: 'Check crypto price.'},
        {command: '/compare_price', description: 'Compare crypto price.'}
    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        if (text === '/start') {
            return bot.sendMessage(chatId, `Welcome, ${msg.from.first_name} ${msg.from.last_name}!`)
        }
        if (text === '/check_price') {
            let message = ''
            await getPrices()
            const allCryptos = await getDataDb()
            for (const el of allCryptos) {
                message += `${el.name} ${el.price} ${el.fiat} \n`
            }
            return bot.sendMessage(chatId, message)

        }
        if (text === '/compare_price') {
            await getPrices()

            const usdPrice = convertToUsd()

            const greenCircle = '\u{1F7E2}    ',
                    redCircle = '\u{1F534}    '

            let profitMessage = ''
            const profit = await getDataDb()
            for (const el of profit) {
                let allProfit = +(el.price * el.initialCrypto - el.initialFiat).toFixed(2)
                let allProfitP = +(allProfit / el.initialFiat * 100).toFixed(2)
                profitMessage += `${allProfit} ${allProfitP}\n`
            }

            let dogeProfit = +(await getDataDb(process.env.DOGE) * process.env.DOGE_CRY - usdPrice.doge).toFixed(2),
                dogeProfitP = +(dogeProfit / usdPrice.doge * 100).toFixed(2),

                bnbProfit = +(await getDataDb(process.env.BNB) * process.env.BNB_CRY - usdPrice.bnb).toFixed(2),
                bnbProfitP = +(bnbProfit / usdPrice.bnb * 100).toFixed(2),

                manaProfit = +(await getDataDb(process.env.MANA) * process.env.MANA_CRY - usdPrice.mana).toFixed(2),
                manaProfitP = +(manaProfit / usdPrice.mana * 100).toFixed(2),

                adaProfit = +(await getDataDb(process.env.ADA) * process.env.ADA_CRY - usdPrice.ada).toFixed(2),
                adaProfitP = +(adaProfit / usdPrice.ada * 100).toFixed(2),

                linkProfit = +(await getDataDb(process.env.LINK) * process.env.LINK_CRY - usdPrice.link).toFixed(2),
                linkProfitP = +(linkProfit / usdPrice.link * 100).toFixed(2),

                solProfit = +(await getDataDb(process.env.SOL) * process.env.SOL_CRY - usdPrice.sol).toFixed(2),
                solProfitP = +(solProfit / usdPrice.sol * 100).toFixed(2),

                dotProfit = +(await getDataDb(process.env.DOT) * process.env.DOT_CRY - usdPrice.dot).toFixed(2),
                dotProfitP = +(dotProfit / usdPrice.dot * 100).toFixed(2),

                maticProfit = +(await getDataDb(process.env.MATIC) * process.env.MATIC_CRY - usdPrice.matic).toFixed(2),
                maticProfitP = +(maticProfit / usdPrice.matic * 100).toFixed(2),

                xrpProfit = +(await getDataDb(process.env.XRP) * process.env.XRP_CRY - usdPrice.xrp).toFixed(2),
                xrpProfitP = +(xrpProfit / usdPrice.xrp * 100).toFixed(2),

                ethProfit = +(await getDataDb(process.env.ETH) * process.env.ETH_CRY - usdPrice.eth).toFixed(2),
                ethProfitP = +(ethProfit / usdPrice.eth * 100).toFixed(2),

                totalProfit = (dogeProfit + bnbProfit + manaProfit + adaProfit + linkProfit + solProfit + dotProfit + maticProfit + xrpProfit + ethProfit - process.env.FEES * 1.18).toFixed(2)

            return bot.sendMessage(chatId, profitMessage)
        }
        return bot.sendMessage(chatId, 'No such command. :)')
    })
}

getDataDb(process.env.ETH)
start()