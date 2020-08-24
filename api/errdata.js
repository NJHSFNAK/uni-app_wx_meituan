// 提示
const errdata = {
	errlist(err){
		uni.showToast({
			title:err,
			duration:3000,
			icon:'none'
		})
	}
}

export {errdata}
