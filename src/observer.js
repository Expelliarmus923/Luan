export default class Observer {
    constructor(data) {
        this.dep = new Dep();
        this.initObserver(data);
    }
    initObserver(data) {
        if (!data || Object.prototype.toString.call(data) !== '[object Object]')
            return;
        Object.keys(data).forEach(subObjKey => {
            this.defineReactive(subObjKey, data[subObjKey], data);
        });
    }
    defineReactive(key, value, data) {
        //继续监听自属性。
        let childObj = this.initObserver(value),dep = this.dep,_this = this;
        Object.defineProperty(data, key, {
            configurable: true,
            enumerable: true,
            set(newVal) {
                if (newVal === value) {
                    return;
                }
                //赋值操作
                value = newVal;
                //新值是object继续监听
                childObj = _this.initObserver(value);
                dep.notify();
            },
            get() {
                if (Dep.target) {
                    dep.addSub(Dep.target);
                }
                return value;
            }
        });
    }
}

export class Dep {
    constructor() {
        this.subs = [];
    }
    //发起通知
    notify() {
        this.subs.forEach(watcher => {
            watcher.update();
        });
    }
    addSub(watcher) {
        this.subs.push(watcher);
    }
}
