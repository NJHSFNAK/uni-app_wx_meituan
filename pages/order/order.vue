<template>
	<!-- 用户订单界面 -->
	<view>
		<block v-for="(item,index) in neworder" :key="index">
		<view class="order-back">
			<view class="order-view">
				<view class="order-img">
					<image :src="item.logo" mode="aspectFill"></image>
				</view>
				<view class="goods-commodity">{{item.body}}</view>
				<view class="order-succ" v-if="item.status === 1">
					付款成功
				</view>
				<view class="order-succ" v-else>
					待付款
				</view>
			</view>
			<!-- 2 -->
			<view>
				<block v-for="(itemdata,index) in item.Paymentinfor" :key="index">
				<view class="order-dishes">
					<text>{{itemdata.input}}</text>
					<text>x{{itemdata.amount}}</text>
				</view>
				</block>
			</view>	
			<view class="order-Total">
				<view class="order-left">
					<!-- 因为返回的值的status都是0，要想看见去评价界面，只能让其等于0，
							正常返回值应该是status为0和1两种，0是未下单，1是已下单-->
					<text v-if="item.status === 0" @click="evaLuate(item.merchantid,item.body)">去评价</text>
				</view>
				<view class="order-right">
					<text>共{{item.Paymentinfor.length}}件商品</text>
					<text>合计：{{item.total_fee}}元</text>
				</view>
			</view>
		</view>
		</block>
		<!-- 提示 -->
		<tips ref="tips"></tips>
		<!-- loading全局组件 -->
		<home-load v-if="efinition"></home-load>
	</view>
</template>

<script>
	// 引入提示用户没有登录的组件
	import tips from '@/element/tips.vue';
	
	// 网络请求
	import {wxpayingUrl} from '@/api/request.js';
	import {publicing} from '@/api/api.js';
	
	var {log} = console;
	
	export default {
		components: {
			tips
		},
		data() {
			return {
				// 用户的openid
				openid:'',
				// 网络请求之后，返回的数据
				neworder: [],
				// 控制loading组件显示与隐藏
				efinition: false
			}
		},
		methods: {
			// 看订单的前提条件是用户是否登陆
			ifLogin(){
				let setdata = uni.getStorageSync('usermen');
				if(!setdata){
					let bull = true;
					let tips = '请登录后查看订单详情';
					this.tising(bull,tips);
					this.efinition = false;
				}else{
					this.efinition = true;
					// 获取openid
					this.openid = setdata.openid;
					let bull = false;
					let tips = "";
					this.tising(bull,tips);
					this.orderIng();
				}
			},
			// 反馈提示
			tising(bull,tips){
				this.$nextTick(()=>{
					this.$refs.tips.init(bull,tips);
				})
			},
			// 请求数据
			orderIng(){
				let data = {
					type: 'myorder',
					openid: this.openid
				};
				publicing(wxpayingUrl,data)
					.then((res)=>{
						log(res);
						// 用户还未下单
						if(res.data.datas.length === 0){
							let bull = true;
							let tips = "还未下单";
							this.tising(bull,tips);
						}else{
							let bull = false;
							let tips = "";
							this.tising(bull,tips);
							// 筛选需要的数据
							/* 
								因为原本返回的data.datas中的数据太多
								因此截取了前100个数组数据
							*/
							let neworder = res.data.datas.slice(0,100).map((item)=>{
								let merchantid = item._merchantid;
								let openid = item._openid;
								let status = item.status;
								/* 商家名称   因为返回值中没有body参数，因此写死为‘九风土菜馆’ */
								let body = '九风土菜馆';
								let logo = item.wxorder.logo;
								let total_fee = item.wxorder.total_fee;
								let Paymentinfor = item.wxorder.Paymentinfor.arrinfo;
								return {
									merchantid,
									openid,
									status,
									body,
									logo,
									total_fee,
									Paymentinfor
								}
							}); 
							log(neworder);
							this.neworder = neworder;
							this.efinition = false;
						}
					})
					.catch((err)=>{
						log(err);
					})
			},
			// 去评价按钮的函数
			evaLuate(ide,body){
				uni.navigateTo({
					url:'../evaluate/evaluate?ide='+ide+'&body='+body
				})
			}
		},
		onShow() {
			this.ifLogin();
		}
	}
</script>

<style>
	page{
		background: #f2f3f4;
	}
	
	.order-back{
		background: #FFFFFF;
		margin: 10upx;
		padding: 20upx 10upx;
		border-radius: 9upx;
	}
	
	.order-img{
		width: 100upx; 
		height: 100upx; 
		padding-right: 20upx;
	}
	
	.order-view image{
		width: 100upx; 
		height: 100upx; 
		border-radius: 10upx;
	}
	
	.order-view{
		height: 106upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		overflow: hidden;
	}
	
	.goods-commodity{
		flex-grow: 1; 
		font-size: 30upx; 
		font-weight: bold;
	}
	
	.order-succ{
		font-size: 28upx;
		color: #666666;
	}
	
	.order-dishes{
		font-size: 28upx;
		color: #666666;
		display: flex; 
		align-items: center; 
		justify-content: space-between;
		height: 80upx;
	}
	
	.order-Total text{
		display: block;
	}
		
	.order-right text:nth-child(1){
		padding-right: 10upx;
	}
	
	.order-Total{ 
		font-size: 28upx;
		color: #666666;
		display: flex; 
		align-items: center;
		justify-content: space-between;
		height: 80upx;
	}
	
	.order-right{
		display: flex; 
		align-items: center;
	}
	
	.order-left text{
		background: #f2f3f4; 
		border-radius: 10upx;
		padding: 5upx 10upx;
	}
</style>
