import Vue from 'vue'
import App from './color.vue'
import ElementUI from 'element-ui'
import '../../styles/element-variables.scss'
import "../../scripts/common.js";

Vue.use(ElementUI);

/* eslint-disable no-new */
window.onload = function() {
    new Vue({
        el: '#app',
        components: {App},
        template: '<App/>'
    })
}
