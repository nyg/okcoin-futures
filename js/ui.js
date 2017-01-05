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
}

function updateAmounts(ccy, type, amount) {

    var index = getIndex(ccy),
        diff = amount - index,
        delta = diff / index * 100

    updateCell(ccy + '-price-' + type, amount)
    updateCell(ccy + '-diff-' + type, diff)
    updateCell(ccy + '-perc-' + type, delta)

    if (ccy == 'btc' && type == 'quarterly') {
        setPageTitle(amount, diff, delta)
    }
}

function updateCell(spanId, newValue) {
    var value = getValue(spanId)
    setValue(spanId, newValue)
    setMinMaxValue(spanId, newValue)
    setValueStyle(spanId, value, newValue)
}

function setPageTitle(amount, diff, delta) {
    document.title = amount.toFixed(2) + ' - ' + diff.toFixed(2) + ' - ' + delta.toFixed(2) + '%'
}

function setValue(spanId, value) {
    document.getElementById(spanId).textContent = value.toFixed(2)
    document.getElementById(spanId).setAttribute('exact-value', value)
}

function setMinMaxValue(spanId, value) {
    var min = getValue(spanId + '-min', Infinity),
        max = getValue(spanId + '-max', -Infinity)
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

function getValue(spanId, defaultValue) {
    var span = document.getElementById(spanId)
    if (span == null) console.log(spanId)
    return parseFloat(span.getAttribute('exact-value')) || defaultValue
}
