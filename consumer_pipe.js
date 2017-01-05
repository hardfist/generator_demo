let fs = require('fs')
function coroutine(func){
    function start(...args){
        let cr = func(...args)
        cr.next();
        return cr;
    }
    return start;
}

// source 
function* follow(file,target){
    let content = fs.readFileSync(file);
    let lines = content.toString().split('\n');
    for(let line of lines){
        target.next(line);
    }
}
// filter
function* grep(pattern,target){
    while(true){
        line = (yield);
        if(pattern.test(line)){
            target.next(line);
        }
    }
}
function *logger(target){
    let num = 0;
    while(true){
        let line = (yield);
        num++;
        console.log(`${num}:${line}`)
        target.next(line);
    }
}
// sink
function* printer(){
    while(true){
        line = (yield)
        console.log('printer:',line)
    }
}

// 使用coroutine包装
follow = coroutine(follow);
grep = coroutine(grep);
logger = coroutine(logger);
printer = coroutine(printer);

follow('access-log',logger(grep(/javascript/,printer())))