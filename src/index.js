import Observer from './observer.js';
import Compile from './compile.js';
export default class Vue{
   constructor({data,el,methods,mounted}){
       this.data = data;
       this.methods = methods;
       this.ProxyData();
       new Observer(this.data);
       new Compile(el, this);
       mounted.call(this);
       
   }
   ProxyData(){
       Object.keys(this.data).forEach((key)=>{
           Object.defineProperty(this, key, {
               configurable: true,
               enumerable: true,
               get(){
                   return this.data[key];
               },
               set(newVal){
                   this.data[key] = newVal;
               }
           })
       })
   }
}




