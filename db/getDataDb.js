const {MongoClient} = require('mongodb')

const client = new MongoClient(process.env.DB_KEY)

const getDataDb = async () => {
    try {
        await client.connect()

        const cryptoPricesDb = client.db().collection('CryptoPrices')
        const allCryptos = await cryptoPricesDb.find({finder: 'crypto'})
            .toArray()
        console.log(allCryptos)
        return allCryptos
    } catch (e) {
        console.log(`Something went wrong on getting data from DB, ${e}`)
    }
}

module.exports = getDataDb