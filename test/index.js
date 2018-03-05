import Vue from '../src/index.js';

var vue = new Vue({
    data:{
        name: 'lulizhou'
    },
    exp:'name'
});
vue.data.name = {firstName: 'lu', lastName: 'lizhou'};

vue.data.name.firstName = 'chen';