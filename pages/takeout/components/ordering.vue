<template>
	<!-- 商品展示下单 -->
	<view class="ordering-fls">
		<!-- 商品分类左边 -->
		<view class="ordering-left">
			<block v-for="(item,index) in orderclass" :key="index">
			<text :class="{activeord:index === currentIndex}" 
				@click="ordermeClic(index,item)">{{item}}</text>
			</block>
		</view>
		<!-- 商品列表：右边 -->
		<view class="ordering-right">
			<text class="ordering-right-title">{{ordertitle}}</text>
			<view>
				<block v-for="(item,index) in classifarr" :key="index">
					<view class="content-view">
						<!-- 左边商品图片 -->
						<view class="content-img">
							<image :src="item.objdis.image" mode="aspectFill"></image>
						</view> 
						<!-- 右边商品详情 -->
						<view class="content-title">
							<text class="conteng-take">{{item.objdis.input}}</text>
							<view class="conteng-monthly">
								<block v-for="(itemdata,index) in item.objdis.tags" :key="index">
								<text>{{itemdata}}</text>
								</block>
							</view>
							<view class="conteng-starting">
								<text>月售10</text>
							</view>
							<view class="conteng-price">
								<view class="conteng-shi">¥{{item.objdis.Discount}}</view>
								<view class="conteng-hua">¥{{item.objdis.Price}}</view>
								<view class="ordering-price">
									<!-- 传的值是商品数量、每个商品唯一的id、每个商品的index、每个商品的单价、每个商品的图片、每个商品的名称 -->
									<image @click="reDuce(item.amount,item._id,index,item.objdis.Discount,item.objdis.image,item.objdis.input)"  
										src="../../../static/coen/jianhao.png" mode="widthFix"></image>
									<text class="amounting">{{item.amount}}</text>
									<image @click="pLus(item.amount,item._id,index,item.objdis.Discount,item.objdis.image,item.objdis.input)" 
										src="../../../static/coen/jiahao.png" mode="widthFix"></image>
								</view>
							</view>
						</view>
					</view>
				</block>
			</view>
		</view>
		<!-- 总价计算区域 -->
		<view class="Shopping">
			<!-- 骑手 -->
			<view class="qishou">
				<image v-if="!isActive" src="../../../static/coen/weigou.png" mode="widthFix"></image>
				<image v-if="isActive" src="../../../static/coen/yigou.png" mode="widthFix"></image>
			</view>
			<!-- 多少量 -->
			<view class="Numbering" v-if="isActive">{{takeLength.length}}</view>
			<!-- 金额 -->
			<view class="Shopping-dis">
				<view class="Shopping-left">
					<view class="Cost-mony">
						<text class="Total-price">¥{{Takeawayprice}}</text>
						<text class="Delivery">另需配送费{{physical}}元</text>
					</view> 
				</view>
				<view class="Shopping-right" :class="{shoppactive: isActive}" 
					@click="flat && settLement()">
					<!-- 商品未加入购物车是x元起送 -->
					<text v-if="!isActive">{{delivering}}元起送</text>
					<!-- 商品加入购物车是x元结算 -->
					<text v-if="isActive">{{difference}}</text>
				</view>
			</view>
		</view>
		<!-- 登录弹窗组件 -->
		<modal ref="mon"></modal>
	</view>
</template>

<script>
	var {log} = console;
	
	// 引入弹窗组件
	import modal from '@/element/modal.vue';
	
	export default{
		components: {
			modal
		},
		props: {
			orderingdata: {
				type: Array,
				default: []
			},
			busidata:{
				type: Object,
				default(){
					return {}
				}
			}
		},
		data() {
			return {
				// 为左边商品动态添加样式
				currentIndex: 0,
				// 左边商品的文字
				orderclass:[],
				// 动态显示左边商品被选中的文字
				ordertitle:'',
				// 控制外卖小哥的图片是否高亮
				isActive: false,
				// 用户进入页面右边默认展示的商品数据
				classifarr: [],
				// 右边商品的总数据
				commodity:{},
				// 商家配送费
				physical: 0,
				// 商家起送费
				delivering: Number,
				// 商品数量
				amount: 0,
				// 存放得到总价的商品
				arrtotalPrice:[],
				// 商品总价
				Takeawayprice: 0,
				// 用户选择几份商品
				takeLength: 0,
				// 离起送金额还差多少钱
				difference: '',
				// 控制去结算按钮是否可以点击
				flat: false,
				// 商家标识
				MerchantId: '',
				// 商家名称
				nameshop: '',
				// 商家logo
				logo:''
			}
		},
		methods: {
			// 为左边商品动态添加样式
			ordermeClic(index,classifitem) {
				this.currentIndex = index;
				this.ordertitle = classifitem;
				// 分类切换
				let itemarr = this.commodity.filter((item)=>{
					return item.optidata === classifitem;
				})
				log(itemarr);
				this.classifarr = itemarr;
			},
			// 加价按钮
			pLus(amounts,indexs,index,price,image,input){
				this.amount = Number(amounts)+ Number(1);
				this.pushData(indexs,index,price,image,input);
			},
			// 减价按钮
			reDuce(amounts,indexs,index,price,image,input){
				this.amount = Number(amounts)- Number(1);
				this.pushData(indexs,index,price,image,input);
			},
			// 加减价按钮公用函数
			pushData(indexs,index,price,image,input){
				let findarr = this.classifarr.filter((item, index)=>{
					if(item._id === indexs){
						if(this.amount < 1){
							return item.amount = '0';
						}else{
							return item.amount = this.amount;
						}
					}
				});
				// log(findarr);
				// 得到更改的数组重新更新数组classifarr数组，数组顺序要保持不变
				this.classifarr[index] = findarr[0];
				// 计算总价  单价*数量
				if(Number(this.amount) <= 0){
					this.amount = 0;
				};
				let Totalprice = parseFloat((Number(this.amount)* price).toFixed(2));
				log(price);
				
				
				// 
				// 把单个商品得到的总价作为一个对象push到一个数组中，方便多个商品计算总价
				let fands = {
					indexs,
					Totalprice,
					image,
					input,
					"amount": this.amount,
					price
				};
				this.arrtotalPrice.push(fands);
				log(this.arrtotalPrice);
				// 查询当前点击商品_id，替换总价
				let findarrdata = this.arrtotalPrice.map((item)=>{
					return item.indexs === indexs ?  fands : item;
				});
				// log(findarrdata);
				this.arrtotalPrice = findarrdata;
			},
			// 去结算按钮的事件
			settLement(){
				log('去结算');
				// 去结算前条件是否已经登录
				let setdata = uni.getStorageSync('usermen');
				if(!setdata){
					// 用户没有登录
					this.$nextTick(()=>{
						this.$refs.mon.modaishow = true;
					});
				}else{
					// 已经登录
					this.$refs.mon.modaishow = false;
					/* 需要传递的值有：1.需要支付的总金额、2.配送费、3.用户openid、 
						4.商家标识、5.商家名称、6.商家名称、 7.点的商品个数 */
					// 需要支付的总金额
					let payment = parseFloat((this.Takeawayprice+this.physical).toFixed(2));
					let Ordering = {
						payment,
						physical: this.physical,
						openid: setdata.openid,
						MerchantId: this.MerchantId,
						nameshop: this.nameshop,
						logo: this.logo,
						allorder: this.takeLength
					}
					// 路劲后不能携带对象和数组
					let strorder = JSON.stringify(Ordering);
					uni.navigateTo({
						url:'../placeorder/placeorder?ide='+ strorder,
					})
				}
			}
		},
		computed: {
			clauulaton(){
				// 监听总价
				// 1.数组对象去重----reduce
				let arr = {};
				let arrdata = this.arrtotalPrice.reduce((preVal,curVal)=>{
					arr[curVal.indexs] ?'' :arr[curVal.indexs] = true && preVal.push(curVal);
					return preVal
				},[]);
				// log(arrdata);
				// 去除总价为0的商品
				this.takeLength = arrdata.filter((item)=>{
					return item.Totalprice != 0
				});
				// log(taoarr);
				// 所有商品的总价累计之和
				let numdata = 0;
				arrdata.forEach((item)=>{
					numdata += item.Totalprice;
				});
				// log(numdata);
				// 商品价格的总价
				this.Takeawayprice = parseFloat(numdata.toFixed(2));
			},
			// 是否满足下单的条件
			condition(){
				if(this.Takeawayprice === 0){
					this.isActive = false;
					this.flat = false;
				}else{
					this.isActive = true;
					this.flat = true;
					if(this.Takeawayprice < this.delivering){
						// 不达到起送金额
						// this.isActive = true;
						this.difference ='还差'+parseFloat((this.delivering - this.Takeawayprice).toFixed(2))+'元';
						this.flat = false;
					}else{
						this.difference = '去结算'	;
						this.flat = true;
					}
				}
			}
		},
		watch: {
			// 用户进入该页面，1.默认展示在第一个tabs(盖浇饭) 2.并且默认展示该分类下面的商品
			orderingdata(newValue, oldValue) {
				// log(newValue);
				// 1.取出左边的商品分类
				let classifdata = newValue.map((item)=>{
					return item.optidata
				});
				// log(classifdata);
				// 数组去重
				this.orderclass = Array.from(new Set(classifdata));
				// log(this.orderclass);
				// 2.右边商品
				this.commodity = newValue;
				// 3.右边默认分类为第一个内容
				this.ordertitle = newValue[0].optidata;
				// 4.往商品里面添加一个字段为0
				let commodiydata = newValue.map((item)=>{
					let key = 'amount';
					let value = 0;
					return item[key] = value;
				});
				// log(commodiydata);
				// 5.右边商品默认展示第一个tab里面的数据
				let classifarr = newValue.filter((item)=>{
					return item.optidata === newValue[0].optidata
				});
				// log(classifarr)
				this.classifarr = classifarr;
			},
			// 商家介绍的数据
			busidata(newValue,oldValue){
				// 商家配送费;
				log(newValue);
				this.physical = newValue.physical;
				// 商家起送费
				this.delivering = newValue.delivering;
				// 商家标识
				this.MerchantId = newValue.openid;
				// 商家名称
				this.nameshop = newValue.shop;
				// 商家logo
				this.logo = newValue.logo;
			}
		},
	}
</script>

<style scoped>
	.ordering-fls{
		display: flex; 
		justify-content: space-between;
	}
	
	/* 左边商品分类 */
	.ordering-left{
		width: 190upx; 
		background: #fafafa;
		overflow-y: auto;
		height: 100%;
	}
	
	.ordering-left text{
		color: #a8a8a8;
		display: block;
		font-size: 28upx;
		height: 80upx;
		line-height: 80upx;
		text-align: center;
	}
	
	.activeord{
		background: #FFFFFF !important; 
		font-weight: bold !important;
	}
	
	/* 右边 */
	.ordering-right{
		width: 100%;
		padding: 9upx 9upx 130upx 9upx;
		overflow: hidden;
		overflow-y: auto;
	}
	
	.activeord{
		background: #FFFFFF !important; 
		font-weight: bold !important;
	}
	
	.ordering-right-title{
		font-size: 28upx;
		height: 60upx;
		line-height: 60upx;
	}
	
	.content-view{
		display: flex; 
		justify-content: space-between;
		height: 200upx !important; 
		overflow: hidden;
		margin: 30upx 0;
		color: #898989;
	}
	
	.content-img{
		width: 180rpx !important; 
		height: 200rpx !important;
		overflow: hidden;
	}
	
	.content-img image{
		width: 100%; 
		height: 100%; 
		border-radius: 10upx;
		overflow: hidden;
	}
	
	.content-title{
		/* width: 100%; */
		padding-left: 10upx;
		font-size: 24upx;
	}
	
	.conteng-take{
		color: #333333;
		height: 50upx; 
		font-size: 33upx;
		font-weight: bold;
		line-height: 50upx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}
	
	.conteng-monthly{
		display: flex;
	}
	
	.conteng-monthly text{
		background: #f1f1f1;
		margin-right: 9upx;
		padding: 4upx 13upx;
		border-radius: 7upx;
		display: block;
	}
	
	.conteng-starting{
		display: flex;
		align-items: center;
		height: 50upx;
		line-height: 50upx;
	}
	
	.conteng-price image{
		width: 60upx; 
		height: 60upx;
	}
	
	.conteng-price{
		display: flex; 
		align-items: center;
	}
	
	.ordering-price{
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;
	}
	
	/* 数量 */
	.amounting{
		width: 50upx;
		text-align: center;
	}
	
	.conteng-hua{
		text-decoration: line-through;
	}
	
	.conteng-shi{
		color: #fb4e44; 
		font-size: 33upx;
		width: 180upx;
		overflow: hidden;
	}
	
	/* 购物车 */
	.Shopping{
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
	}
	.Shopping-left{
		height: 130upx;
		background: #000000; 
		flex-grow: 2;
		border-top-left-radius: 50upx;
		border-bottom-left-radius: 50upx;
	}
	.Shopping-right{
		height: 130upx;
		line-height: 130upx;
		font-size: 30upx;
		color: #7f7f7f;
		text-align: center;
		background: #000000; flex-grow: 1;
		border-top-right-radius: 50upx;
		border-bottom-right-radius: 50upx;
	}
	
	.Shopping-dis{
		display: flex;
		height: 130upx;
		margin: 0 20upx;
	}
	
	.qishou{
		width: 120upx; 
		height: 150upx;
		position: fixed;
		bottom: 0upx;
		left: 50upx;
	}
	.qishou image{
		width: 120upx; 
		height: 150upx !important;
	}
	
	/* 定位 */
	.Delivery{
		color: #999999;
		font-size: 28upx;
		height: 65upx;
	}
	
	.Shopping-left text{
		display: block;
	}
	
	.Total-price{
		font-size: 40upx; 
		color: #FFFFFF;
		height: 65upx;
		line-height: 65upx;
	}
	
	.Cost-mony{
		padding-left: 170upx; 
		color: #4CD964;
		height: 130upx;
	}
	
	/* 数量 */
	.Numbering{
		background: red;
		width: 40upx;
		height: 40upx;
		border-radius: 50%;
		font-size: 20upx;
		color: #FFFFFF;
		text-align: center;
		line-height: 40upx;
		position: fixed;
		bottom: 50upx;
		left: 130upx;
	}
	
	/* 选中菜品 */
	.shoppactive{
		background: #ffd300 !important;
		color: #000000 !important;
	}
</style>
