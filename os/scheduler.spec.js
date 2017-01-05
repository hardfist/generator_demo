var Scheduler = require('./scheduler').Scheduler;
function* foo(){
        console.log("I'm foo")
        yield
}
function* bar(){
        console.log("I'm bar")
        yield 
}

let sched = new Scheduler()
sched.new(foo())
sched.new(bar())
sched.mainloop()