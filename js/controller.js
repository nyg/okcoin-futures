document.getElementById('clear-min').onclick = clearMinValues
document.getElementById('clear-max').onclick = clearMaxValues
document.getElementById('clear-all').onclick = clearAllValues

loadMinMaxValues()

new OKCoin('com', {
    ok_sub_futureusd_btc_index: handleMessage,
    ok_sub_futureusd_btc_trade_this_week: handleMessage,
    ok_sub_futureusd_btc_trade_next_week: handleMessage,
    ok_sub_futureusd_btc_trade_quarter: handleMessage,
    ok_sub_futureusd_ltc_index: handleMessage,
    ok_sub_futureusd_ltc_trade_this_week: handleMessage,
    ok_sub_futureusd_ltc_trade_next_week: handleMessage,
    ok_sub_futureusd_ltc_trade_quarter: handleMessage,
}).start()

new OKCoin('cn', {
    ok_sub_spotcny_btc_trades: handleMessage,
    ok_sub_spotcny_ltc_trades: handleMessage
}).start()

function handleMessage(message) {
    if (message.hasOwnProperty('data')) {
        if (message.data.hasOwnProperty('futureIndex')) {
            updateTable(message.channel, parseFloat(message.data.futureIndex))
        }
        else {
            message.data.forEach(function (trade) {
                updateTable(message.channel, parseFloat(trade[1]))
            })
        }
    }
    else {
        console.log(message)
    }
}
