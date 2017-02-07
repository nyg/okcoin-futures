function updateTable(channel, amount) {

    var ccy = channel.match(/btc/) ? 'btc' : 'ltc'

    if (channel.match(/trades/)) {
        updateCell(ccy + '-price-cny', amount)
    }
    else if (channel.match(/index/)) {
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

    if (ccy == 'btc' && channel.match(/quarter|trades/)) {
        updatePageTitle()
    }
}

function updateAmounts(ccy, type, amount) {

    var index = getIndex(ccy),
        diff = amount - index,
        delta = diff / index * 100

    updateCell(ccy + '-price-' + type, amount)
    updateCell(ccy + '-diff-' + type, diff)
    updateCell(ccy + '-perc-' + type, delta)
}

function updateCell(spanId, newValue) {
    var value = getValue(spanId)
    setValue(spanId, newValue)
    setMinMaxValue(spanId, newValue)
    setValueStyle(spanId, value, newValue)
}

function updatePageTitle() {
    var spot = getSpotBtcCny() || 0,
        index = getIndex('btc') || 1
        quarterly = getQuarterlyBtc() || 0,
        diff = quarterly - index,
        delta = diff / index * 100
    document.title = spot.toFixed(2) + ' • ' + quarterly.toFixed(2) + ' • ' + diff.toFixed(2) + ' • ' + delta.toFixed(2) + '%'
}

function setValue(spanId, value, store) {

    if (store != false) store = true

    document.getElementById(spanId).textContent = value.toFixed(2)
    document.getElementById(spanId).setAttribute('exact-value', value)

    if (store && spanId.match(/min|max/)) {
        storeValue(spanId, value)
    }
}

function setMinMaxValue(spanId, value) {

    var min = getStoredValue(spanId + '-min', Infinity),
        max = getStoredValue(spanId + '-max', -Infinity)

    if (value < min) {
        setValue(spanId + '-min', value)
    }
    if (value > max) {
        setValue(spanId + '-max', value)
    }
}

function setValueStyle(spanId, value, newValue) {

    var span = document.getElementById(spanId)
    span.style.fontSize = '16px'

    if (newValue > value) {
        span.style.color = 'green'
    }
    else if (newValue < value) {
        span.style.color = 'red'
    }
}

function getIndex(ccy) {
    return getValue(ccy + '-price-index')
}

function getSpotBtcCny() {
    return getValue('btc-price-cny')
}

function getQuarterlyBtc() {
    return getValue('btc-price-quarterly')
}

function getValue(spanId, defaultValue) {
    return parseFloat(document.getElementById(spanId).getAttribute('exact-value')) || defaultValue
}
