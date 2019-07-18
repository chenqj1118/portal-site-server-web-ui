import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import login from './login.vue';
import ElementUI from 'element-ui';

import "../../scripts/common.js";
import "../../styles/common.scss";
import "../../styles/login.scss";

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(ElementUI);

window.onload = function(){
    new Vue({
        el: '#app',
        components:{login}
    })

}