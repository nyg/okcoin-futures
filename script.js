var ws = new WebSocket('wss://real.okcoin.com:10440/websocket/okcoinapi')

ws.onopen = function () {
    console.log('Connection opened')
    ws.send(JSON.stringify([
        {'event':'addChannel','channel':'ok_sub_spotusd_btc_trades'},
        {'event':'addChannel','channel':'ok_sub_futureusd_btc_trade_this_week'},
        {'event':'addChannel','channel':'ok_sub_futureusd_btc_trade_next_week'},
        {'event':'addChannel','channel':'ok_sub_futureusd_btc_trade_quarter'}
    ]))
}

ws.onmessage = function (event) {
    var data = JSON.parse(event.data)
    if ('[object Array]' == Object.prototype.toString.call(data)) {
        data.forEach(function (message) {
            handle(message)
        })
    }
    else {
        console.log(data)
    }
}

ws.onerror = function (e) {
    console.log(e)
}

ws.onclose = function () {
    console.log('Connection closed')
}

var spot, weekly, biWeekly, quarterly;

function handle(message) {
    if (message.hasOwnProperty('data')) {
        message.data.forEach(function (trade) {
            updateTable(message.channel, parseFloat(trade[1]))
        })
    }
    else {
        console.log(message)
    }
}

function updateTable(channel, amount) {
    switch (channel) {
        case 'ok_sub_spotusd_btc_trades':
            spot = amount
            updateCell('price-spot', amount);
            break;
        case 'ok_sub_futureusd_btc_trade_this_week':
            weekly = amount
            updateAmounts('weekly', amount)
            break;
        case 'ok_sub_futureusd_btc_trade_next_week':
            biWeekly = amount
            updateAmounts('bi-weekly', amount)
            break;
        case 'ok_sub_futureusd_btc_trade_quarter':
            quarterly = amount
            updateAmounts('quarterly', amount)
            break;
    }
}

function updateAmounts(type, amount) {
    updateCell('price-' + type, amount)
    updateCell('diff-' + type, amount - spot)
    updateCell('perc-' + type, (amount - spot) / spot * 100)
}

function updateCell(cellId, newAmount) {
    var cell = document.getElementById(cellId),
        currentAmount = parseFloat(cell.getAttribute('exact-value')) || 0
    cell.setAttribute('exact-value', newAmount)
    cell.textContent = newAmount.toFixed(2)
    cell.style.color = newAmount > currentAmount ? 'green' : 'red'
}
