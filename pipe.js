var fs = require('fs')
function* grep(pattern,lines){
    for(let line of lines){
        if(pattern.test(line)){
            yield line
        }
    }
}
function* follow(file){
    let content = fs.readFileSync(file)
    let lines = content.toString().split('\n')
    for(let line of lines){
        yield line;
    }
}
let logfile = 'access-log'
loglines = follow(logfile)
pylines = grep(/javascript/,loglines)
for(let line of pylines){
    console.log(line)
}