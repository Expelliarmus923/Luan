import Watcher from './watcher.js';
const NODETYPE = {
    ELEMENT_NODE: 1,
    TEXT_NODE: 3
};
const directiveReg = /^v-on:(\S+)$/g;
export default class compile {
    constructor(el, vm) {
        this.vm = vm;
        this.el = document.querySelector(el);
        this.fragment = this.nodeToFragment(this.el);
        this.compileFragment(this.fragment);
        this.el.appendChild(this.fragment);
    }
    nodeToFragment(el) {
        //创建一个DocumentFragment，它表示一个没有父级文件的最小文档对象，
        //一个轻量版的Document
        //最大的区别是因为DocumentFragment不是真实DOM树的一部分，
        //它的变化不会引起DOM树的重新渲染的操作(reflow) ，且不会导致性能等问题。 ---MDN
        let fragment = document.createDocumentFragment(),
            child = el.firstChild;
        while (child) {
            fragment.appendChild(child); //如果被插入的节点已经存在于当前文档的文档树中,则那个节点会首先从原先的位置移除,然后再插入到新的位置.
            child = el.firstChild;
        }
        return fragment;
    }
    compileFragment(fragment) {
        let childNodes = fragment.childNodes;
        [...childNodes].forEach(node => {
            if (this.isTextNode(node)) this.compileTextNode(node);
            if (this.isElementNode(node)) this.compileElementNode(node);
            if (node.childNodes && node.childNodes.length > 0)
                this.compileFragment(node);
        });
    }
    compileTextNode(node) {
        let textContent = node.textContent,
            reg = /{{\s?(.*?)\s?}}/g,
            regResult = reg.exec(textContent);
        //过滤空节点和匹配不上的节点
        if (/^\s+$/g.test(textContent) || regResult === null) return;
        
        this.updateTextNode(node, this.vm[regResult[1]]);
        
        new Watcher(this.vm, regResult[1], newVal => {
            this.updateTextNode(node, newVal);
        });
    }
    updateTextNode(node, val) {
        return (node.textContent = typeof val === 'undefined' ? '' : val);
    }
    compileElementNode(node) {
        let nodeAttr = node.attributes;
        [...nodeAttr].forEach((attr)=>{
           let name = attr.name;
           let testCotent = attr.textContent;
            if(this.isDirective(name)) this.compileDirective(node, name, testCotent);
            if(this.isModel(name)) this.compileModel(node, name, testCotent);
        });
    }
    compileDirective(node, name, method){
        let directiveReg = /^v-on:(\S+)$/g;
        let eventType =directiveReg.exec(name)[1];
        let cb = this.vm.methods && this.vm.methods[method];
        node.addEventListener(eventType, cb.bind(this.vm), false);
    }
    compileModel(node, name, exp){
         let value = this.vm[exp];
         this.updateModel(node, value);
         new Watcher(this.vm, exp, newVal=>{
            this.updateModel(node, newVal)
         });
         node.addEventListener('input', e=>{
            let newVal = e.target.value;
            if(newVal === value) return;
            this.vm[exp] = newVal;
            value = newVal;
         }, false);
    }
    updateModel(node, val){
        return (node.value = typeof val === 'undefined' ? '' : val);
    }
    isModel(name){
        return /^v-model$/g.test(name);
    }
    isDirective(name){
        return directiveReg.test(name);
    }
    isTextNode(node) {
        return node.nodeType === NODETYPE.TEXT_NODE;
    }
    isElementNode(node) {
        return node.nodeType === NODETYPE.ELEMENT_NODE;
    }
}
