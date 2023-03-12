const request = require('request');

exports.notifyEvent = (msg) => {
    request({
        uri: 'https://notify-api.line.me/api/notify', 
        method: 'POST',
        auth: {
            bearer:'okO3shjt2gXdUachP3NUadC5vcYtO8ETvbaDJgnNOhh' //token
        },
        form:{
            message: msg
        }
    })
}