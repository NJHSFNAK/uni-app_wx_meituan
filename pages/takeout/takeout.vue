<template>
	<!-- 商家详情界面 -->
	<view>
		<!-- 商家介绍 -->
		<business :busidata='busidata'></business>
		<!-- tabs切换 -->
		<tabs></tabs>
		<view class="ordering-sceate">
			<!-- 商品下单 -->
			<ordering :class="[hiding === 0?'actineclass':'errorclass']" 
				:orderingdata='orderingdata' :busidata='busidata'></ordering>
			<!-- 商家评价 -->
			<message :class="[hiding === 1?'actineclass':'errorclass']" 
				:messagedata='messagedata' :tabmessage='tabmessage' ref="message"></message>
			<!-- 商家详情 -->
			<introduce :class="[hiding === 2?'actineclass':'errorclass']" 
				:busidata='busidata'></introduce>
		</view>
		<!-- loading组件 -->
		<home-load v-if="efinition"></home-load>
	</view>
</template>

<script>
	import business from './components/business.vue';
	import tabs from './components/tabs.vue';
	import ordering from './components/ordering.vue';
	import message from './components/message.vue';
	import introduce from './components/introduce.vue';
	
	var {log} = console;
	
	// 网络请求
	import {publicing} from '../../api/api.js';
	import {discussUrl,shopUrl,getdishUrl} from '../../api/request.js';
	
	export default {
		components: {
			business,
			tabs,
			ordering,
			message,
			introduce
		},
		data() {
			return {
				hiding: 0,
				// 商家介绍
				busidata:{},
				// 商品数据
				orderingdata:[],
				// 商家评论
				messagedata:[],
				// 数组合并
				tabmessage: [],
				// 商家唯一标识
				ids:'',
				// 控制loading组件显示与隐藏
				efinition: true
			}
		},
		methods: {
			fatherMethod(index) {
				this.hiding = index;
			},
			// 请求数据
			takeFun(ids){
				let data = {
					openid:ids
				};
				let disdata = {
					merchantid: ids
				};
				Promise.all([publicing(shopUrl,data),publicing(getdishUrl,data),publicing(discussUrl,disdata)])
					.then((res)=>{
						log(res);
						// 商家介绍
						this.busidata = res[0].data[0];
						// 商品数据
						this.orderingdata = res[1].data;
						// 商家评论
						this.messagedata = res[2].data;
						if(res[2].data.length === 0){
							// 没有商家评论
							this.$refs.message.enptylist = false;
						}else{
							this.$refs.message.enptylist = true;
							// 评论分类标签去重去空
							// 1.取出评论标签放在数组中
							let messagedata = res[2].data.map((item)=>{
								return item.classmessage
							});
							// log(messagedata);
							// 2.数组去重
							let newarr = Array.from(new Set(messagedata));
							// 3.数组去空
							var newArr = newarr.filter((item)=>item);
							// 数组合并
							this.tabmessage = ['全部',...newArr];
						}
						this.efinition = false;
					})
					.catch((err)=>{
						log(err)
					})
			},
			// 被评论子组件调用的函数
			messageMethod(item){
				// log(item);
				if(item === '全部'){
					let data = {
						merchantid: this.ids
					};
					this.classifMessage(data);
				}else{
					let data = {
						merchantid: this.ids,
						classmessage: item
					};
					this.classifMessage(data);
				}
			},
			// 请求评论分类的数据
			classifMessage(data){
				publicing(discussUrl,data)
					.then((res)=>{
						// log(res);
						this.messagedata = res.data;
					})
					.catch((err)=>{
						log(err);
					})
			}
		},
		onLoad(e){
			this.takeFun(e.id);
			this.ids = e.id;
			log(e);
		}
	}
</script>

<style scoped>
	.actineclass{
		display: block;
		overflow: auto;
		height: 100%;
	}
	
	.errorclass{
		display: none;
	}
	
	.ordering-sceate{
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		top: 230upx;
	}
</style>
