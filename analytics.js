const ua = require('universal-analytics');
const uuid = require('uuid/v4');
const Store = require('electron-store');
const store = new Store();

// Setup User Analytics
const userId = store.get('userId') || uuid();
store.set('userId', userId);

const user = ua('UA-75056533-4', userId);



const trackEvent = (category, action, label, value) => {
    user.event({
        ec: category,
        ea: action,
        el: label,
        ev: value
    })
    .send();
}


module.exports = {
    trackEvent
}