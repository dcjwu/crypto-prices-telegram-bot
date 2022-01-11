const {MongoClient} = require('mongodb')
const parsePrice = require('../scripts/parser')

const client = new MongoClient('mongodb+srv://admin:admin_root777@cluster0.yrgtg.mongodb.net/TgBotApp?retryWrites=true&w=majority')

const updateDb = async (cryptoType, cryptoInfo) => {
    try {
        await client.connect()
        const cryptoPricesDb = client.db().collection('CryptoPrices')

        parsePrice(cryptoInfo[0])
            .then((price) => {
                let cryptoPrice = Number(price.replace(/[,$]/g, ''))
                cryptoPricesDb.updateOne(
                    {name: cryptoType},
                    {
                        $set: {
                            price: cryptoPrice,
                            initialCrypto: cryptoInfo[1],
                            initialFiat: cryptoInfo[2]
                        }
                    }
                )
            })
    } catch (e) {
        console.log(`Something went wrong on updating DB, ${e}`)
    }
}

module.exports = updateDb