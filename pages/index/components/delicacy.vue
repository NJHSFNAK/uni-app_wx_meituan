<template>
	<view>
		<view class="prefer-posi">
			<!-- 筛选区 -->
			<view class="delica-view">
				<view class="delica-list delica-grow" @click="multiple()">
					<text>{{synthesize}}</text>
					<image src="../../../static/coen/paixu.png" mode="widthFix"></image>
				</view>
				<view class="delica-grow" @click="saLes()">销量高</view>	
				<view class="delica-grow" @click="saLes()">速度快</view>
				<view class="delica-grow" @click="saLes()">津贴联盟</view>
				<view class="delica-list delica-right" @click="scReen()">
					<text>筛选</text>
					<image src="../../../static/coen/shaixuan.png" mode="widthFix"></image>
				</view>
			</view>
			<!-- 综合排序筛选 -->
			<view class="sortlist sortliteltle" v-if="drop">
				<block v-for="(item,index) in sortlist" :key="index">
				<text @click="sortClick(item.name,index,item.screen,item.nums)" :class="{activeb: num=== index}">{{item.name}}</text>
				</block>
			</view>
			<!-- 多个筛选区 -->
			<view class="sortlist sortlist-view" v-if="sortmen">
				<!-- 多选：商家特色 -->
				<block v-for="(item,index) in screendata" :key="index">
				<view>
					<view class="sortlist-title">{{item.title}}</view>
					<view class="sortlist-flex">
						<block v-for="(itemdata,indexs) in item.datas" :key="indexs">
						<text class="Choice" :class="{scractive:itemdata.id === 2}" 
							@click="screenchoIce(indexs,itemdata.sign)">{{itemdata.name}}</text>
						</block>
					</view>
				</view>
				</block>
				<!-- 单选：人均价 -->
				<block v-for="(item,index) in person" :key="index">
				<view>
					<view class="sortlist-title">{{item.title}}</view>
					<view class="sortlist-flex">
						<block v-for="(itemdata,indexs) in item.datas" :key="indexs">
						<text class="Choice" :class="{scractive: indexs === currentIndex}" 
							@click="personchoIce(indexs,itemdata.per)">{{itemdata.name}}</text>
						</block>
					</view>
				</view>
				</block>
				<!-- 置顶 -->
				<view class="sortlist-bottom">
					<text @click="emPty()">清空</text>
					<text @click="flag && compLete()">完成</text>
				</view>
			</view>
		</view>
		<!-- 透明背景 -->
		<view class="sdBack" v-if="sdBack" @click="backClick"></view>
	</view>
</template>

<script>
	var {log} = console;
	
	// 网络请求
	import {startingUrl,multipleUrl} from '@/api/request.js';
	import {publicing} from '@/api/api.js';
	
 	export default{
		data() {
			return {
				// 透明背景是否显示
				sdBack: false,
				// 综合排序的显示与隐藏
				drop: false,
				// 综合排序的动态显示的内容
				synthesize: '综合排序',
				// 综合排序的动态加入背景颜色
				num: 0,
				// 多个筛选区的显示与隐藏
				sortmen: false,
				// 综合排序的内容
				sortlist: [
					{
						"name":"综合排序",
						"screen":"_id",
						"nums":1
					},
					{
						"name":"起送价最低",
						"screen":"delivering",
						"nums":1
					},
					{
						"name":"配送费最低",
						"screen":"physical",
						"nums":1
					},
					{
						"name":"人均高到低",
						"screen":"capita",
						"nums":-1
					},
					{
						"name":"人均低到高",
						"screen":"capita",
						"nums":1
					}
				],
				// 多选的内容
				screendata:[
					{
						'title':'商家特色(可多选)',
						"datas":[
							{
								"id":1,
								"sign":'duration',
								"name":'配送最快'
							},
							{
								"id":1,
								"sign":'deliver',
								"name":'0元起送'
							},
							{
								"id":1,
								"sign":'physi',
								"name":'免配送费'
							}
						]
					}
				],
				// 人均价的内容
				person:[
					{
						"title":"人均价",
						"datas":[
							{
							"name":"20元以下",
							"per":{
								"$lt":20
								},
							},
							{
							"name":"20-40元",
							"per":{
								"$lte":40,
								"$gte":20
								},
							},
							{
							"name":"40元以上",
							"per":{
								"$gt":40
								},
							},
						]
					}
				],
				// 选中人均价的
				currentIndex: -1,
				// 接收筛选的对象
				multiobj:{},
				// 完成按钮被禁用
				flag: false
			}
		},
		methods: {
			multiple() {
				this.backOne();
				this.drop = true;
				this.sortmen = false;
			},	
			sortClick(name,index,screen,nums){
				this.synthesize = name;
				this.num = index;
				this.backClick();
				this.starTing(screen,nums);
			},
			// 控制透明背景的显示函数
			backOne(){
				setTimeout(()=>{
					this.sdBack = true;
				},100)
			},
			// 点击透明背景和点击综合排序内容实现隐藏的函数
			backClick(){
				this.drop = false;
				this.sdBack = false;
			},
			// 点击 销量高、速度快、津贴联盟 实现其他透明背景、综合排序和筛选内容页面的隐藏
			saLes(){
				this.backClick();
				this.sortmen= false;
			},
			// 点击筛选实现透明背景消失
			scReen(){
				this.drop = false;
				this.sortmen = true;
			},
			// 综合排序的网络请求
			starTing(screen,nums){
				let data = {
					screen,
					nums
				}
				publicing(startingUrl,data)
					.then((res)=>{
						log(res);
						// vuex存储数据
						this.$store.commit('screenmuta',res.data);
					})
					.catch((err)=>{
						log(err);
					})
			},
			// 多选筛选区的商家特色内容选中
			screenchoIce(index,sign){
				if(this.screendata[0].datas[index].id === 1){
					this.screendata[0].datas[index].id = 2;
					// 向对象中添加属性
					this.$set(this.multiobj,sign,sign);
					log(this.multiobbj);
				}else{
					this.screendata[0].datas[index].id = 1;
					// 向对象中移除属性
					this.$delete(this.multiobj,sign);
				}
			},
			// 多选筛选区的人均价内容选中
			personchoIce(index,per){
				if(this.currentIndex< 0){
					this.currentIndex = index;
					this.$set(this.multiobj,'capita',per);
				}else{
					this.currentIndex = -1;
					this.$delete(this.multiobj,'capita');
				}
			},
			// 多选筛选区的清空按钮事件
			emPty(){
				this.screendata.forEach((item)=>{
					let arr = item.datas.map((items)=>{
					 return items.id = 1;
					})
				});
				this.currentIndex = -1;
				this.backClick();
				this.sortmen= false;
				this.multiobj = {};
			},
			// 多选筛选区的完成按钮事件
			compLete(){
				this.backClick();
				this.sortmen= false;
				publicing(multipleUrl,this.multiobj)
					.then((res)=>{
						this.$store.commit('screenmuta',res.data)
					})
					.catch((err)=>{
						log(err);
					})
			}
		},
		computed: {
			// 用户没有点击任何筛选条件，完成按钮应该被禁用
			emptyIng() {
				let obj = JSON.stringify(this.multiobj) === '{}';
				if(obj === true){
					this.flag = false;
				}else{
					this.flag = true;
				}
			}
		},
	}
</script>

<style scoped>
	/* 筛选区 */
	.delica-view image{
		width: 30upx; 
		height: 30upx; 
		display: block;
	}
	
	.delica-view{
		font-size: 30upx; 
		display: flex; 
		align-items: center;
		color: #666666;
		height: 70upx;
		padding: 0 15upx;
		background: #FFFFFF;
	} 
	
	.delica-list{
		display: flex; 
		align-items: center;
	}
	
	.delica-right{
		justify-content: flex-end; 
		flex-grow: 5;
	}
	
	.delica-grow{
		flex-grow: 1;
	}
	
	.prefer-posi{
		position: absolute; 
		left: 0; 
		right: 0;
		width: 100%;
		z-index: 99;
	}
	
	/* 排序 */
	.sortlist{
		background: #ffffff;
	}
	
	.sortliteltle text{
		padding: 0 15upx;
		display: block;
		font-size: 30upx;
		height: 70upx;
		line-height: 70upx;
		border-top: 1rpx solid #ededed;
	}
	
	.activeb{
		color: #f89903 !important;
	}
	/* 选择 */
	/*相对定位*/
	.sortlist-view{
		height: 700upx; 
		overflow: hidden;
		overflow-y: scroll;
		position: relative;
	}
	
	.sortlist-title{
		padding: 0 15upx;
		font-size: 30upx;
		height: 60upx;
		line-height: 60upx;
	}
	
	.Choice{
		font-size: 28upx; 
		background: #f8f8f8;
		height: 55upx;
		line-height: 55upx;
		color: #666666;
		width: calc((100% / 3) - 15px) !important;
		margin: 7.5px;
		text-align: center;
		display: block;
		border-radius: 5upx;
	}
	
	.sortlist-flex{
		display: flex; 
		flex-wrap: wrap;
		align-items: center;
		margin-bottom: 30upx;
	}
	
	.sortlist-bottom{
		background: #ffffff; 
		height: 80upx;
		border-top: 1upx solid #e4e4e4;
		display: flex; justify-content: space-around;
		align-items: center;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
	}
	
	.sortlist-bottom text{
		flex-grow: 1; 
		height: 80upx;
		line-height: 80upx;
		text-align: center;
	}
	
	.sortlist-bottom text:nth-child(1){
		border-right: 1upx solid #e4e4e4;
	}
	
	.sortlist-bottom text:nth-child(2){
		background: #ffd348;
	}
	
	.sdBack{
		background: rgba(0,0,0,0.5); 
		position: fixed; 
		top: 0; 
		left: 0; 
		right: 0; 
		bottom: 0;
	}
		
	/* 商家特色加样式 */
	.scractive{
		background: #fef6df !important; 
		color: #f29909 !important;
	}
</style>
