<template>
	<!-- 首页界面 -->
	<view class="contenting">
		<search></search>
		<preference :preferdata='preferdata'></preference>
		<title></title>
		<view @click="poll()" :catchtouchmove = 'true'>
			<delicacy id="boxFixed" :class="{is_fixed: isfixed}"></delicacy>
		</view>
		<view style="margin-top: 100upx;">
			<takeout :takeshop='takeshop'></takeout>
		</view>
		<!-- loading组件 -->
		<home-load v-if="efinition"></home-load>
	</view>
</template>

<script>
	import delicacy from './components/delicacy.vue';
	import preference from './components/preference.vue';
	import search from './components/search.vue';
	import takeout from './components/takeout.vue';
	import title from './components/title.vue';
	
	var {log} = console;
	
	// 引入网络请求
	import {listing} from '../../api/api.js';
	import {getpreferUrl,wxshopUrl} from '../../api/request.js';
	
	// 引入vuex的mapstate
	import {mapState} from 'vuex';
	
	export default {
		components: {
			delicacy,
			preference,
			search,
			takeout,
			title
		},
		data() {
			return {
				// 为你优选
				preferdata:[],
				// 商家列表
				takeshop: [],
				// 筛选组件到顶部的距离
				menutop: 0,
				// 页面滚动的距离
				rect: 0,
				// 控制是否置顶
				isfixed: false,
				// 控制loading全局组件的显示与隐藏
				efinition: true
			}
		},
		onShow() {	
			this.preference();
		},
		methods: {
			// 为你优选和附近商家的并发网络请求
			preference(){
				Promise.all([listing(getpreferUrl),listing(wxshopUrl)])
				.then((res)=>{
					// log(res);
					// 为你优选
					this.preferdata = res[0].data;
					// 附近商家
					this.takeshop = res[1].data;
					// 数据渲染完毕，loading组件消失
					this.efinition = false;
				})
				.catch((err)=>{
					// log(err);
				})
			},
			
			// 点击筛选组件回到顶部
			poll(){
				wx.pageScrollTo({
					scrollTop: this.menutop,
					duration: 300
				})
			}
		},
		// 监听页面滚动距离
		onPageScroll(e) {
			// log(e);
			this.rect = e.scrollTop;
		},
		// 进入页面就开始监听到筛选组件到顶部的距离
		onLoad() {
			const query = wx.createSelectorQuery();
			query.select('#boxFixed').boundingClientRect();
			query.exec((res)=>{
				log(res[0].top);
				this.menutop = res[0].top;
			})
		},
		computed: {
			...mapState(['screendata']),
			// 监听筛选组件置顶和不置顶
			namepage() {
				// 如果页面高度大于筛选组件距离组件的距离，那就置顶，反之
				if(this.rect>= this.menutop){
					// log('置顶')
					this.isfixed = true;
				}else{
					this.isfixed = false;
				}
			},
			// 取得筛选出来商家的数据
			count(){
				this.takeshop = this.screendata.screenarr;
			}
		},
	}
</script>

<style scoped>
	.contenting{
		margin: 0 15upx;
	}
	
	.is_fixed{
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
	}
</style>
