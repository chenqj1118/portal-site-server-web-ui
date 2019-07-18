import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
	{
		path: '/',
		redirect: '/index'
	},
    {
      path: '/index',
      name: 'index',
      component: resolve => require(['../components/main_content'], resolve),
    },
    {
      path: '/child/:name?',
      name: 'child',
      component: resolve => require(['../components/main_content/child'], resolve),
    }
  ]
})
