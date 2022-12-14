try {
    // eslint-disable-next-line no-console,no-undef
    console.log(`Версия сборки: ${__APP_VERSION__}`);
} catch (e) {
    // ..
}

/* eslint-disable */
window.warn = console.warn;
window.debug = console.log;
/* eslint-enable */

// CustomEvent() constructor functionality in IE9, IE10, IE11
(function CustomEventIIFE() {
    if (typeof window.CustomEvent === "function") {
        return false;
    }

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined }; // eslint-disable-line
        const evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
}());

moment.locale("ru");
