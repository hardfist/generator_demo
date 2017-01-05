let Scheduler = require('./scheduler').Scheduler
let GetTid = require('./system_call').GetTid
let NewTask = require('./system_call').NewTask
let KillTask = require('./system_call').KillTask
let WaitTask = require('./system_call').WaitTask


function* foo(){
    let mytid = yield new GetTid()
    for(let i=0;i<1;i++){
        console.log(`I'm foo ${mytid}`)
        yield 
    }
}
function* bar(){
    let mytid = yield new GetTid()
    for(let i=0;i<2;i++){
        console.log(`I'm bar ${mytid}`)
        yield 
    }
}

// test KillTask && NewTask
function* sometask(){
    let mytid = yield new GetTid()
    console.log(`I'm sometask ${mytid}`)
    let t1 = yield new NewTask(bar())
    console.log(`Before killing `)
    yield new KillTask(t1)
}
let sched = new Scheduler()
sched.new(sometask())
sched.mainloop()

// test WaitTask 
function* main(){
    let child = yield new  NewTask(foo())
    console.log(`Waiting for child`)
    yield new WaitTask(child)
    console.log('child done')
}

sched = new Scheduler()
sched.new(main())
sched.mainloop()