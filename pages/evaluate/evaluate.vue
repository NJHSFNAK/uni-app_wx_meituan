<template>
	<!-- 发表评论 -->
	<view>
		<view class="Comment-text">
			<textarea  :placeholder="place" 
				v-model="Comment" show-confirm-bar="false" focus="true"/>
		</view>
		<!-- 发表按钮 -->
		<view class="published" @click="flat && bTn()">
			发表
		</view>
		<!-- 提示组件 -->
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
		
	</view> 
</template>

<script>
	var {log} = console;
	
	// 引入提示组件
	import HMmessages from "@/components/HM-messages/HM-messages.vue";
	
	// 引入网络请求
	import {publicing} from '@/api/api.js';
	import {commentUrl} from '@/api/request.js';
	
	export default {
		components: {
			HMmessages
		},
		data() {
			return {
				// textarea内的内容
				Comment:'',
				// textarea中的placeholder内容
				place:'',
				// 商家标识
				ide:'',
				// 用户信息
				userdata:{},
				// 控制发表按钮是否能够使用
				flat: true
			}
		},
		methods: {
			// 发表按钮的函数
			bTn(){
				if(this.Comment === ''){
					let succ = '评论不能为空';
					let icon = 'error';
					this.tIps(succ,icon);
					return false;
				}else{
					this.flat = false;
					this.messAge();
				}
			},
			tIps(succ,icon){
				this.HMmessages.show(succ,{icon,
					fontColor:"#ffffff",iconColor:'#ffffff',background:'rgba(102,0,51,0.8)'});
			},
			// 评论的网络请求
			messAge(){
				let data = {
					messages: this.Comment,
					avatarUrl: this.userdata.avatarUrl,
					nickName: this.userdata.nickName,
					openid: this.userdata.openid,
					merchantid: this.ide
				};
				publicing(commentUrl,data)
					.then((res)=>{
						log(res);
						// 评论成功后
						// 1.清空评论信息
						this.Comment = '';
						// 2.提示用户评论成功
						let succ = '评论成功';
						let icon = 'success';
						this.tIps(succ,icon);
						this.flat = true;
					})
					.catch((err)=>{
						log(err);
						let succ = '服务器错误';
						let icon = 'error';
						this.tIps(succ,icon);
					})
			}
		},
		onLoad(e) {
			log(e);
			// 商家名称
			this.place ='写下你对' +e.body+'商家的评价';
			// 商家标识
			this.ide = e.ide;
			// 用户信息
			this.userdata = uni.getStorageSync('usermen');
		}
	}
</script>

<style>
	page{
		background: #F1F1F1;
	}
	
	.Comment-text textarea{
		width: 100%; 
		color: #808080 !important; 
		font-size: 30upx;
		padding: 8upx;
	}
	
	.Comment-text{
		background: #FFFFFF;
	}
	
	.published{
		font-size: 35upx; 
		background: #ffdd00;
		width: 300upx;
		text-align: center;
		margin: 20upx auto;
		padding: 10upx 0;
		border-radius: 10upx;
	}
</style>
