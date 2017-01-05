let sax = require('sax'),
    fs = require('fs'),
    strict = true,
    parser = sax.parser(strict);
function coroutine(func) {
    function start(...args) {
        let cr = func(...args)
        cr.next();
        return cr;
    }
    return start;
}

function *printer(){
    while(true){
        let value = (yield)
        console.log('bus:',JSON.stringify(value))
    }
}
function* buses_to_dicts(target) {
    while (true) {
        let {event, value} = (yield)
        if (event == 'opentag' && value.name == 'bus') {
            let busdict = {},
                fragments = []
            while (true) {
                let {event, value} = (yield)
                switch (event) {
                    case 'opentag':
                        fragments = []
                        break;
                    case 'text':
                        fragments.push(value)
                        break;
                    case 'closetag':
                        if (value != 'bus') {
                            busdict[value] = fragments.join('')
                        } else {
                            target.next(busdict)
                        }
                        break;
                }
            }
        }
    }
}
buses_to_dicts = coroutine(buses_to_dicts);
printer = coroutine(printer)
class EventHandler {
    constructor(saxStream, target) {
        this.saxStream = saxStream
        this.target = target
    }
    on(type, handler) {
        this.saxStream.on(type, handler.bind(this))
        return this;
    }
}
let saxStream = sax.createStream(strict)
let event = new EventHandler(saxStream, buses_to_dicts(printer()));
event.on('error', function (err) {
    console.log('err:', err)
}).on('opentag', function (node) {
    this.target.next({event:'opentag',value:node})
}).on('closetag', function (text) {
    this.target.next({event:'closetag',value:text})
}).on('text', function (text) {
    this.target.next({event:'text',value:text})
})
fs.createReadStream('bus.xml')
    .pipe(event.saxStream)