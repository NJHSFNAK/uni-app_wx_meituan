<template>
	<!-- 确定支付界面 -->
	<view>
		<view class="place-view">
			<view class="place-addres" v-if="addreing" @click="addRess()">
				+ 新增收货地址
			</view>
			<!-- 已选中收货地址 -->
			<view class="goods-address" v-if="!addreing" @click="addRess()">
				<view class="goods-address-left">
					<image src="../../static/coen/address.png" mode="widthFix"></image>
				</view>
				<view class="goods-address-in">
					<view>{{addressing.detailInfo}}</view>
					<view class="goods-address-name">
						<text>{{addressing.userName}}</text>
						<text>{{addressing.telNumber}}</text>
					</view>
				</view>
				<view class="goods-address-right">
					<image src="../../static/coen/jiantou.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="place-time">
				<image src="../../static/coen/times.png" mode="widthFix"></image>
				<text>立即送出</text>
			</view>
		</view>
		<!-- 菜单 -->
		<view class="place-view">
			<view>
				<block v-for="(item,index) in allorder" :key="index">
					<view class="order-view">
						<view class="order-img">
							<image :src="item.image" mode="aspectFill"></image>
						</view>
						<view class="order-title">
							<text>{{item.input}}</text>
							<text>x{{item.amount}}</text>
						</view>
						<view class="order-price">
							单价:¥{{item.price}}
						</view>
					</view>
				</block>
			</view>
		</view>
		<!-- 配送费 -->
		<view class="place-view">
			<view class="Delivery">配送费：¥{{physical}}</view>
		</view>
		<!-- 高度 -->
		<view style="height: 140upx;"></view>
		<!-- 支付 -->
		<view class="payment">
			<view class="payment-left">
				<text>合计</text>
				<text>¥{{payment}}</text>
			</view>
			<view class="payment-right" @click="toPay()">
				去支付
			</view>
		</view>
		<HMmessages ref="HMmessages" 
			@complete="HMmessages = $refs.HMmessages"@clickMessage="clickMessage"></HMmessages>
	</view>
</template>

<script>
	var {log} = console;
	
	// 引入提示组件
	import HMmessages from "@/components/HM-messages/HM-messages.vue";
	
	// 引入网络请求组件
	import {wxpayingUrl} from '@/api/request.js';
	import {publicing} from '@/api/api.js';
	
	export default {
		components: {
			HMmessages
		},
		data() {
			return {
				addreing: true,
				// 获取商品数据
				allorder:'',
				// openid
				openid :'',
				// 支付的总价
				payment: '',
				// 配送费
				physical :'',
				// 商家标识
				MerchantId: '',
				// 商家名称
				shopname :'',
				// 商家logo
				logo: '',
				// 收货人的总信息
				addressing: {}
			}
		},
		methods: {
			// 选择收货地址
			addRess(){
				wx.chooseAddress({
					success:(res)=>{
						log(res);
						this.addreing = false;
						this.addressing = res;
					}
				})
			},
			/* 发起微信支付的条件: 
					1.需要营业执照 
					2.开通微信商户平台绑定已经认证的小程序的appid,后端调用微信支付
			*/
		 // 去支付按钮的函数
		 toPay(){
			 if(this.addreing === true){
				 // 用户没有选择收货地址
				 log('用户没有选择收货地址');
				 let succ = '请选择收货地址';
				 let ico = 'error';
				 this.tIps(succ,ico);
				 return false;
			 }else{
				 log('可以支付了');
				 this.wxPay();
			 }
		 },
		 // 微信支付的函数
		 async wxPay(){
			 // 提示用户正在下单，防止用户多次点击下单按钮
			 // wx.showToast与wx.hideToast是一起使用的
			 wx.showToast({
			 	title:'正在下单',
				icon:'loading',
				duration:2000,
				mask:true
			 });
			 // 微信支付需要的必填参数
			 // 客户信息
			 let peopleobj = {
			 	address:{
			 		address: this.addressing.detailInfo,
			 		name: this.addressing.userName,
			 		iphone: this.addressing.telNumber
			 	}
			 };
			 // 商家标识	
			 let merchantid = this.MerchantId;
			 // 商家标识字符串
			 let ide = this.MerchantId.slice(0,7);
			 // 商家名称
			 let commod = this.shopname;
			 // 商家logo
			 let logo = this.logo;
			 // 需要的必填参数
			 let Paymentinfo = {
				type: 'placeOrder',
				peopleobj,
				arrinfo: this.allorder,
				merchantid,
				ide,
				commod,
				logo,
				useropenid: this.openid,
				payment: this.payment
			 };
			 // 异步编程同步化
			 /* 
					因为没有后台搭建支付平台和开通商家服务
					因此微信支付的1、2、3步不能够使用
					微信支付的第一步有返回值，缺少商家服务和未搭建支付平台
					接口返回的值是少两个
			*/
		 
		 
		 
			return false	
			
			
			
			
			
			 // 1.统一下单
			 let Placeorder = await this.placeorder(Paymentinfo);
			 log(Placeorder);
			 let Payparame = Placeorder.data.datas;
			 // 2.发起支付---扫码支付
			 let wxpay = await this.wxPays(Payparame);
			 // 3.查询是否支付成功
			 let paysucc = await this.paySucc(Payparame);
		 },
		 // 1.统一下单的具体函数实现
		 placeorder(Paymentinfo){
			return new Promise((resolve,reject)=>{
			 publicing(wxpayingUrl,Paymentinfo)
			 .then((res)=>{
				resolve(res);
				wx.hideToast();
			 })
			 .catch((err)=>{
				reject(err);
				let succ = '';
				let icon = 'error';
				this.tIps(succ,icon);
			 })
			})
		 },
		 // 2.发起支付	
		 wxPays(Payparame){
			 return new Promise((resolve,reject)=>{
				 wx.requestPayment({
					 timeStamp: Payparame.time_stamp,
					 // nonceStr: Payparame.nonceStr,
					 // package: `prepay_Id=${Payparame.prepayId}`,
					 signType:'MD5',
					 paySign: Payparame.payauto,
					 success:(res)=>{
						 log(res);
						 resolve(res);
					 },
					 fail: (err) => {
					 	log(err);
						reject(err);
					 }
				 })
			 })
		 },
		 // 3.查询是否支付成功
		 paySucc(Payparame){
			 let data = {
				 type: 'paysucc',
				 out_trade_no: Payparame.out_trade_no,
				 id: Payparame._id,
				 merchantid: this.MerchantId
			 };
			 return new Promise((resolve,reject)=>{
				 publicing(wxpayingUrl,data)
					.then((res)=>{
						log(res);
						let succ = '支付成功';
						let icon = 'success';
						this.tIps(succ,icon);
					})
					.catch((err)=>{
						log(err);
						let succ = '支付失败';
						let icon = 'error';
						this.tIps(succ,icon);
					})
			 })
		 },
		 // 弹出提示信息
		 tIps(succ,icon){
		 	this.HMmessages.show(succ,{icon,
		 		fontColor:"#ffffff",iconColor:'#ffffff',background:'rgba(102,0,51,0.8)'});
		 }
		},
		onLoad(e) {
			// 接收下单界面传过来的值	
			log(e);
			let ordermen = JSON.parse(e.ide);
			log(ordermen);
			// 获取商品数据
			this.allorder = ordermen.allorder;
			// openid
			this.openid = ordermen.openid;
			// 支付的总价
			this.payment = ordermen.payment;
			// 配送费
			this.physical = ordermen.physical;
			// 商家标识
			this.MerchantId = ordermen.MerchantId;
			// 商家名称
			this.shopname = ordermen.shopname;
			// 商家logo
			this.logo = ordermen.logo;
		}
	}
</script>

<style>
	page{
		background: #F4f4f4;
	}
	
	.place-view{
		background: #FFFFFF;
		margin: 20upx;
		border-radius: 9upx;
		padding: 35upx 15upx;
	}
	
	.place-addres{
		border: 1rpx solid #ffb000;
		width: 400upx;
		height: 80upx;
		line-height: 80upx;
		border-radius: 50upx;
		text-align: center;
		color: #ffb000;
		margin: 0 auto;
		font-size: 30upx;
	}
	.place-time image{
		width: 40upx; 
		height: 40upx; 
		padding-right: 20upx;
	}
	
	.place-time{
		display: flex; 
		align-items: center; 
		font-size: 30upx;
		border-top: 1rpx solid #F4f4f4;
		padding-top: 35upx;
		margin-top: 35upx;
	}
	
	/* 菜单 */
	.order-view{
		display: flex;
		height: 150upx !important; 
		overflow: hidden;
		margin-bottom: 15upx;
		font-size: 30upx;
	}
	
	.order-view text{
		display: block;
	}
	
	.order-img{
		width: 200upx !important; 
		height: 150upx !important;
		padding-right: 15upx;
	}
	
	.order-img image{
		width: 100%; 
		height: 100%;
	}
	
	.order-title{
		flex-grow: 1;
	}
	
	.order-title text:nth-child(2){
		color: #999999; 
		font-size: 25upx;
	}
	
	.Delivery{
		display: flex;
		justify-content: flex-end;
		font-size: 30upx;
	}
	
	/* 支付 */
	.payment{
		background: #FFFFFF;
		height: 120upx;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30upx;
	}
	
	.payment-left{
		display: flex; 
		align-items: center;
		font-size: 30upx;
	}
	
	.payment-left text:nth-child(2){
		font-weight: bold; 
		font-size: 32upx;
	}
	
	.payment-right{
		background: #07c160; 
		color: #FFFFFF;
		padding: 20upx 60upx;
		font-size: 30upx;
		border-radius: 7upx;
	}
	
	/* 收货地址 */
	.goods-address-left{
		width: 40upx; 
		height: 40upx; 
		padding-right: 20upx;
	}
	
	.goods-address-left image{
		width: 40upx; 
		height: 40upx;
	}
	
	.goods-address-name{
		display: flex; 
		align-items: center; 
		font-size: 28upx;
		padding-top: 10upx;
	}
	
	.goods-address-right{
		width: 40upx; 
		height: 40upx;
	}
	
	.goods-address-right image{
		width: 40upx; 
		height: 40upx;
	}
	
	.goods-address{
		display: flex; 
		align-items: center;
	}
	
	.goods-address-in{
		flex-grow: 1; 
		font-size: 30upx;
	}
	
	.goods-address-name text:nth-child(1){
		padding-right: 10upx;
	}
</style>
