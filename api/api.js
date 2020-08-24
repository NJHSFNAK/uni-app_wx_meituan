// 引入提示组件
import {errdata} from '@/api/errdata.js';

// 封装请求  get post

// GET  
let listing = function(urling){
	return new Promise((resolve,reject)=>{
		uni.request({
			url: urling,
			method:'GET'
		})
		.then((res)=>{
			resolve(res[1]);
		})
		.catch((err)=>{
			let errs = '服务器错误，稍后再试';
			errdata.errlist((errs));
			reject(err);
		})
	})
};

// POST
let publicing = function(urling,shopdata){
	return new Promise((resolve,reject)=>{
		uni.request({
			url: urling,
			method:'POST',
			data: shopdata
		})
		.then((res)=>{
			resolve(res[1]);
		})
		.catch((err)=>{
			let errs = '服务器错误，稍后再试';
			errdata.errlist((errs));
			reject(err);
		})
	})
};

export {listing,publicing}