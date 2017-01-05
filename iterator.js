class Countdown{
    constructor(n){
        this.n = n;
    }
    * [Symbol.iterator](){
        while(this.n>=0){
            yield this.n--;
        }
    }
}

let cnt = new Countdown(10);
let arr = [...cnt];
console.log(arr)

class Tree{
    constructor(val,left=null,right=null){
        this.val = val;
        this.left = left;
        this.right = right;
    }
    *[Symbol.iterator](){
        if(this.left){
            yield* this.left;
        }
        yield this.val;
        if(this.right){
            yield* this.right;
        }
    }
}
let left = new Tree(1)
let right = new Tree(3)
let root = new Tree(2,left,right)
console.log([...root])