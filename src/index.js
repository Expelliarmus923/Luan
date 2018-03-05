import Watch from './watch.js';
import Observer from './observer.js';

export default class Vue{
    constructor({data,exp}){
        this.data = data;
        new Observer(data);
        new Watch(this,exp);
    }
}



