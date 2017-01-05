class Task{
    constructor(target){
        Task.taskid++;
        this.tid = Task.taskid;
        this.target = target;
        this.sendval = null;
    }
    run(){
        return this.target.next(this.sendval)
    }   
}
Task.taskid = 0;
exports.Task = Task;