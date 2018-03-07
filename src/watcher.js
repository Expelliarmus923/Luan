import { Dep } from './observer.js';
/**
 * @param vm 上下文环境即Vue的this
 * @param exp 需要监听对象的key
 * @param cb 监听后的回调
 * @export
 * @class Watch
 */
export default class Watch {
   constructor(vm,exp,cb){
       //获取上下文环境的this
        this.vm = vm;
        this.cb = cb;
        this.exp = exp;
        //保持原始值
        this.value = this.get();
   }
   get(){
       Dep.target = this;
       let value = this.vm['data'][this.exp];
       Dep.target = null;
       return value;
   }
   update(){
       let value = this.vm['data'][this.exp];
       let oldValue = this.value;
       this.value = value;
       this.cb.call(this.vm, value, oldValue);
   }
}
