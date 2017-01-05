function coroutine(func){
    function start(...args){
        let cr = func(...args)
        cr.next();
        return cr;
    }
    return start;
}

function* grep(pattern){
    console.log(`Looking for ${pattern}`)
    while(true){
        line = yield;
        if(pattern.test(line)){
            console.log(line)
        }
    }
}
grep = coroutine(grep);
let co = grep(/javascript/);
co.next('hello world')
co.next('python')
co.next('i love javascript')
