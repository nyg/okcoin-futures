function loadMinMaxValues() {
    if (typeof Storage !== "undefined") {
        for (var i = 0; i < localStorage.length; ++i) {
            var key = localStorage.key(i)
            setValue(key, parseFloat(localStorage.getItem(key)), false)
        }
    }
}

function storeValue(spanId, value) {
    if (typeof Storage !== "undefined") {
        localStorage.setItem(spanId, value)
    }
}

function getStoredValue(spanId, defaultValue) {
    if (typeof Storage !== "undefined") {
        return localStorage.getItem(spanId) || defaultValue
    }
}

function clearMinValues() {
    clearValues(/min/)
}

function clearMaxValues() {
    clearValues(/max/)
}

function clearAllValues() {
    clearValues(/./)
}

function clearValues(regex) {
    if (typeof Storage !== "undefined") {
        for (var i = localStorage.length - 1; i >= 0; --i) {
            var key = localStorage.key(i)
            if (key.match(regex)) {
                localStorage.removeItem(key)
            }
        }
    }
}
