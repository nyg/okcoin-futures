var ws = new WebSocket('wss://real.okcoin.com:10440/websocket/okcoinapi')

ws.onopen = function () {
    console.log('Connection opened')
    ws.send(JSON.stringify([
        {'event':'addChannel','channel':'ok_sub_futureusd_btc_index'},
        {'event':'addChannel','channel':'ok_sub_futureusd_btc_trade_this_week'},
        {'event':'addChannel','channel':'ok_sub_futureusd_btc_trade_next_week'},
        {'event':'addChannel','channel':'ok_sub_futureusd_btc_trade_quarter'},
        {'event':'addChannel','channel':'ok_sub_futureusd_ltc_index'},
        {'event':'addChannel','channel':'ok_sub_futureusd_ltc_trade_this_week'},
        {'event':'addChannel','channel':'ok_sub_futureusd_ltc_trade_next_week'},
        {'event':'addChannel','channel':'ok_sub_futureusd_ltc_trade_quarter'}
    ]))
}

ws.onmessage = function (event) {
    var data = JSON.parse(event.data)
    if (isArray(data)) {
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

function handle(message) {
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

function updateTable(channel, amount) {
    var ccy = channel.match(/btc/) ? 'btc' : 'ltc'
    if (channel.match(/index/)) {
        updateCell(ccy + '-price-index', amount)
    }
    else if (channel.match(/this_week/)) {
        updateAmounts(ccy, 'weekly', amount)
    }
    else if (channel.match(/next_week/)) {
        updateAmounts(ccy, 'bi-weekly', amount)
    }
    else if (channel.match(/quarter/)) {
        updateAmounts(ccy, 'quarterly', amount)
    }
    else {
        console.log(channel)
    }
}

function updateAmounts(ccy, type, amount) {
    var index = getIndex(ccy)
    updateCell(ccy + '-price-' + type, amount)
    updateCell(ccy + '-diff-' + type, amount - index)
    updateCell(ccy + '-perc-' + type, (amount / index - 1) * 100)
}

function updateCell(cellId, newAmount) {
    var cell = document.getElementById(cellId),
        currentAmount = getExactValue(cellId, 0)
    cell.setAttribute('exact-value', newAmount)
    cell.textContent = newAmount.toFixed(2)
    if (newAmount > currentAmount) {
        cell.style.color = 'green'
    }
    else if (newAmount < currentAmount) {
        cell.style.color = 'red'
    }
}

function getIndex(ccy) {
    return getExactValue(ccy + '-price-index')
}

function getExactValue(cellId, defaultValue) {
    var cell = document.getElementById(cellId)
    return parseFloat(cell.getAttribute('exact-value')) || defaultValue
}

function isArray(array) {
    return '[object Array]' == Object.prototype.toString.call(array)
}
