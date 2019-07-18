import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './App';
import router from './router'

import '../../scripts/common.js'
import '../../styles/common.scss'
import '../../styles/my.scss'

Vue.use(ElementUI);

//引入jQuery
import $ from 'jquery'
//引入状态管理
import {store} from './store/store'


window.onload = function(){
	new Vue({
		el: '#app',
		router,
		store,		
		render (h) {
			return h(App)
	    }
	});

	console.log("新闻公告加载完成");	
	console.log(router);	
}

