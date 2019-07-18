import Vue from 'vue'
import App from './index.vue'
import ElementUI from 'element-ui'
import "../../scripts/common.js";
import '../../styles/common.scss'
import "../../styles/index.scss";

Vue.use(ElementUI);

/* eslint-disable no-new */
window.onload = function() {
    new Vue({
        el: '#app',
        components: {App},
        template: '<App/>'
    })
}
