// 登陆公用
// 面向对象   es6 ------- class---->属性和方法--- 方法与方法之间不能有逗号

// 引入网络请求
import {wxloginUrl} from '@/api/request.js';
import {publicing} from '@/api/api.js';

var {log} =console;
	
class logins{
	// 构造参数---->用来接收值
	constructor(wxuser) {
		this.wxuser = wxuser;
		log(this.wxuser);
	}
	// 1.先获取发起请求的必须条件
	async listing(){
		// 获取到用户头像和昵称、code
		let userdata = await this.wxlogin();
		log(userdata);
		// 2. 请求接口，发起登录
		let usermen = await this.gologin(userdata);
		return usermen;
	}
	// 获取用户信息和code
	wxlogin(){
		let wxuser = this.wxuser;
		return new Promise((resolve,reject)=>{
			if(wxuser){
				wx.login({
					success:(res) => {
						log(res);
						// 因为是开发者需要APPID和Appselect,而用户就不需要两项内容
						let data = {
							nickName: wxuser.nickName,
							avatarUrl: wxuser.avatarUrl,
							code: res.code,
							appid : 'wx257e4f31f3298b6b',
							secret : 'cd36ad82019182bbb741e75e4240f994'
						};
						resolve(data);
					},
					fail:(err)=>{
						log(err);
					}
				})
			}
		})
	}
	// 请求接口，发起登录
	gologin(userdata){
		return new Promise((resolve,reject)=>{
		 publicing(wxloginUrl,userdata)
			.then((res)=>{
				log(res);
				resolve('SUCCESS');
				if(res.data.msg === "success"){
					// 登陆成功 存入本地
					uni.setStorageSync('usermen',res.data.datas);
				}
			})
			.catch((err)=>{
				log(err);
			})
		})
	}
}

// 导出类
module.exports = logins;