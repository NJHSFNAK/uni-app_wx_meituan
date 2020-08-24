import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);


const screendata = {
	// 存储筛选出来的数据
	screenarr:[]
}

// 数据仓库
const state= {
	screendata
}

export default new Vuex.Store({
	state,
	// 异步操作
	// actions
	// 同步操作
	mutations:{
		screenmuta(state,data){
			console.log(data);
			// 存储到数据仓库
			state.screendata = {
				screenarr: data
			}
		}
	}
})