function restoreMinMaxValues() {

    if (typeof Storage !== "undefined") {
        for (var i = 0; i < localStorage.length; ++i) {
            var key = localStorage.key(i),
                value = parseFloat(localStorage.getItem(key))
            setValue(key, value, false)
        }
    }
}

function storeValue(spanId, value) {
    if (typeof Storage !== "undefined") {
        localStorage.setItem(spanId, value)
    }
}
