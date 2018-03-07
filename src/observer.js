const _objectproto = Object.prototype;

export class Dep {
    constructor() {
        this.deps = [];
    }
    addDep(watch) {
        this.deps.push(watch);
    }
    notify() {
        this.deps.forEach(watch => {
            watch.update();
        });
    }
}
export default class Observer {
    constructor(data) {
        this.dep = new Dep();
        this.init(data);
    }
    init(data) {
        if (!data || _objectproto.toString.call(data) !== '[object Object]')
            return;
        Object.keys(data).forEach(key => {            
            this.defineReact(key, data[key], data);
        });
    }
    defineReact(key, val, obj) {
        let dep = this.dep;
        this.init(val);
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            set(newVal) {
                if (newVal === val) return;
                val = newVal;
                //通知watch
                dep.notify();
            },
            get() {
                Dep.target && dep.addDep(Dep.target);
                return val;
            }
        });
    }
}

