import Vue from '../src/index.js';

window.vue = new Vue({
    el: '#app',
    data: {
        title: 'hello world',
        name: 'canfoo',
        flag: true
    },
    methods: {
        clickMe: function () {
            if(this.flag){
                this.title = '你好！世界';
            }else{
                this.title = '滚蛋！世界';
            }
            this.flag = !this.flag;
        }
    },
    mounted: function () {
    }
});
