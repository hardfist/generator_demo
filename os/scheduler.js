let Task = require('./task').Task;
let SystemCall = require('./system_call').SystemCall;
class Scheduler{
    constructor(){
        this.ready = [];
        this.taskmap = {};
        this.exit_waiting = {}
    }
    new(target){
        let newtask = new Task(target);
        this.taskmap[newtask.tid] = newtask;
        this.schedule(newtask);
        return newtask.tid;
    }
    schedule(task){
        this.ready.push(task)
    }
    exit(task){
        console.log(`Task ${task.tid} terminated`)
        delete this.taskmap[task.tid]
        // 唤醒所有等待该任务的其他任务
        let tasks = this.exit_waiting[task.tid] || []
        delete this.exit_waiting[task.tid]
        for(let task of tasks){
            this.schedule(task)
        }
    }
    waitforexit(task,waittid){
        if(waittid in this.taskmap){
            this.exit_waiting[waittid] || (this.exit_waiting[waittid] = []).push(task)
            return true 
        }else{
            return false 
        }
    }
    mainloop(){
        while(Object.keys(this.taskmap).length>0){
            let task = this.ready.shift();
            let result = task.run();
            if(result.value instanceof SystemCall){
                let syscall = result.value;
                syscall.task = task 
                syscall.sched = this
                syscall.handle()
                continue 
            }
            if(!result.done){
                this.schedule(task)
            }else{
                this.exit(task)
            }
        }
    }
}
exports.Scheduler = Scheduler;
