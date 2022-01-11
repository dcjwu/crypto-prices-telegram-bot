const convertToUsd = () => {

    const pricesEur = {
        doge: process.env.DOGE_FIAT,
        bnb: process.env.BNB_FIAT,
        mana: process.env.MANA_FIAT,
        ada: process.env.ADA_FIAT,
        link: process.env.LINK_FIAT,
        sol: process.env.SOL_FIAT,
        dot: process.env.DOT_FIAT,
        matic: process.env.MATIC_FIAT,
        xrp: process.env.XRP_FIAT,
        eth: process.env.ETH_FIAT
    }

    // returns a new object with the values at each key mapped using mapFn(value)
    const objectMap = (object, mapFn) => {
        return Object.keys(object).reduce(function(result, key) {
            result[key] = mapFn(object[key])
            return result
        }, {})
    }

    const pricesUsd = objectMap(pricesEur, function(value) {
        return (value*1.18).toFixed(2)
    })

    return pricesUsd
}

module.exports = convertToUsd