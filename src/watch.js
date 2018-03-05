import { Dep } from './observer.js';
export default class Watch {
    //vm 上下文环境
    //exp 需要订阅的key
    constructor(vm, exp) {
        this.vm = vm;
        this.exp = exp;
        this.value = this.get();
    }
    update() {
        let value = this.vm.data[this.exp];
        let oldValue = this.value;
        this.value = value;
    }
    get() {
        //触发get
        Dep.target = this;
        let value = this.vm.data[this.exp];
        Dep.target = null;
        return value;
    }
}
