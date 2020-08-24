import Vue from 'vue';
import App from './App';
import store from './store/store.js';

Vue.config.productionTip = false;
Vue.prototype.$store = store;

// 引入loading组件
import loading from '@/element/loading.vue';
// 全局组件
Vue.component('home-load',loading);

App.mpType = 'app';

const app = new Vue({
	...App,
	store
})
app.$mount()
