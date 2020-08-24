<template>
	<!-- 请用户登录组件 -->
	<view>
		<view class="warp" v-if="modaishow">
			<view class="warp-view">
				<view class="warp-text">请登陆后再操作</view>
				<view class="warp-flex">
					<button @click="messcancel()" plain="true">取消</button>
					<button plain="true" open-type="getUserInfo" @getuserinfo="getUserInfo">登录</button>
				</view>
			</view>
		</view>
		<!-- 提示组件 -->
		<HMmessages ref="HMmessages" 
			@complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
	</view>
</template>

<script>
	var {log} = console;
	
	// 引入网络请求
	import {wxloginUrl} from '@/api/request.js';
	import {publicing} from '@/api/api.js';
	
	// 引入提示组件
	 import HMmessages from "@/components/HM-messages/HM-messages.vue"
	
	export default{
		components: {
			HMmessages
		},
		data() {
			return {
				modaishow: false
			}
		},
		methods: {
			// 取消按钮的函数
			messcancel() {
				this.modaishow = false;
			},
			// 登录按钮的函数
			getUserInfo(event){
				if(event.detail.userInfo){
					// wxing中有昵称、头像信息
					let wxing = event.detail.userInfo
					this.wxCode(wxing.avatarUrl,wxing.nickName);
				}
			},
			// 获取code
			wxCode(avatarUrl,nickName){
				wx.login({
					success:(res) => {
						log(res);
						let code = res.code
						// 因为是开发者需要APPID和Appselect,而用户就不需要两项内容
						let appid = 'wx257e4f31f3298b6b';
						let secret = 'cd36ad82019182bbb741e75e4240f994';
						this.wxLogin(appid,secret,code,nickName,avatarUrl);
					},
					fail:(err)=>{
						log(err);
					}
				})
			},
			// 发送网络请求
			wxLogin(appid,secret,code,nickName,avatarUrl){
				let data = {
					// 普通用户不需要appid,secret
					appid,
					secret,
					code,
					nickName,
					avatarUrl
				};
				publicing(wxloginUrl,data)
					.then((res)=>{
						log(res);	
						if(res.data.msg === "success"){
							// 登陆成功 存入本地
							uni.setStorageSync('usermen',res.data.datas);
							this.modaishow = false;
							let succ = '登陆成功';
							let icon = 'success';
							this.tIps(succ,icon);
						}
					})
					.catch((err)=>{
						log(err);
						let succ = '登陆失败';
						let icon = 'error';
						this.tIps(succ,icon);
					})
			},
			// 弹出提示信息
			tIps(succ,icon){
				this.HMmessages.show(succ,{icon,
					fontColor:"#ffffff",iconColor:'#ffffff',background:'rgba(102,0,51,0.8)'});
			}
		},
	}
</script>

<style scoped>
	/* 模态弹窗布局 */
	.warp{
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: rgba(0,0,0,0.6);
		z-index: 9999;
	}
	
	.warp-view{
		width: 500upx;
		height: 200upx;
		background: #FFFFFF;
		margin: auto;
		position: absolute;
		-webkit-position:absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		border-radius: 8upx;
		overflow: hidden;
	}
	
	.warp-text{
		text-align: center;
		margin-top: 30upx;
		font-size: 34upx;
		color: #666666;
	}		
	
	.warp-flex{ 
		display: flex;
		justify-content: space-around;
		border-top: 1upx solid #EEEEEE;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 80upx;
		line-height: 80upx;
	}
	
	.warp-flex button{
		border: none;
		font-size: 30upx;
	}						
</style>
