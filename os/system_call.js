class SystemCall{
    handle(){

    }
}
class GetTid extends SystemCall{
    constructor(){
        super()
    }
    handle(){
        this.task.sendval = this.task.tid 
        this.sched.schedule(this.task) 

    }
}
class NewTask extends SystemCall{
    constructor(target){
        super()
        this.target = target 
    }
    handle(){
        let tid = this.sched.new(this.target)
        this.task.sendval = tid 
        this.sched.schedule(this.task)
    }
}
class KillTask extends SystemCall{
    constructor(tid){
        super()
        this.tid = tid 
    }
    handle(){
        let task = this.sched.taskmap[this.tid]
        if(task){
            task.target.return()
            this.task.sendval = true 
        }else{
            this.task.sendval = false 
        }
        this.sched.schedule(this.task)
    }
}

class WaitTask extends SystemCall{
    constructor(tid){
        super()
        this.tid = tid 
    }
    handle(){
        let result = this.sched.waitforexit(this.task,this.tid)
        this.task.sendval = result 
        // 如果等待一个不存在的任务，那么直接返回，无需等待
        if(!result){
            this.sched.schedule(this.task)
        }
    }
}
exports.SystemCall = SystemCall;
exports.GetTid = GetTid;
exports.NewTask = NewTask;
exports.KillTask = KillTask;
exports.WaitTask = WaitTask;