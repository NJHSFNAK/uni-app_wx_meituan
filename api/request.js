// 公用地址
let url = 'https://meituan.thexxdd.cn/api/';

// 为你优选
let getpreferUrl = `${url}forshop/getprefer`

// 附近商家
let wxshopUrl = `${url}forshop/wxshop`

// 综合排序
let startingUrl= `${url}forshop/starting`

// 筛选多选
let multipleUrl = `${url}forshop/multiple`

// 搜索
let searchUrl = `${url}forshop/search`

// 评论
let discussUrl = `${url}message/discuss`

// 商家介绍
let shopUrl = `${url}forshop/shop`

// 菜品商品
let getdishUrl = `${url}forshop/getdishes`

// 登录
let wxloginUrl = `${url}wxuser/wxlogin`

//微信支付、我的订单
let wxpayingUrl = `${url}wxpay/wxpaying`

// 提交评论
let commentUrl = `${url}message/comment`
 

export {getpreferUrl,wxshopUrl,startingUrl,multipleUrl,searchUrl,
				discussUrl,shopUrl,getdishUrl,wxloginUrl,wxpayingUrl,commentUrl}