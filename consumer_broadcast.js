let fs = require('fs')
function coroutine(func) {
    function start(...args) {
        let cr = func(...args)
        cr.next();
        return cr;
    }
    return start;
}

// source 
function* follow(file, target) {
    let content = fs.readFileSync(file);
    let lines = content.toString().split('\n');
    for (let line of lines) {
        target.next(line);
    }
}
// filter
function* grep(pattern, target) {
    while (true) {
        line = (yield);
        if (pattern.test(line)) {
            target.next(line);
        }
    }
}
// filter
function* logger(target) {
    let num = 0;
    while (true) {
        let line = (yield);
        num++;
        console.log(`${num}:${line}`)
        target.next(line);
    }
}
// sink
function* printer() {
    while (true) {
        line = (yield)
        console.log('printer:', line)
    }
}

// broadcast 
function* broadcast(targets) {
    while (true) {
        item = (yield)
        for (target of targets) {
            target.next(item)
        }
    }
}

// 使用coroutine包装
follow = coroutine(follow);
grep = coroutine(grep);
logger = coroutine(logger);
printer = coroutine(printer);
broadcast = coroutine(broadcast);
follow('access-log',broadcast([
    grep(/javascript/,printer()),
    grep(/python/,printer()),
    grep(/hello/,printer())
    ]));