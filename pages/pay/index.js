/*
1.页面加载的时候，
    1.缓存中获取购物车的数据，渲染到页面。这些数据， checked=true
2.微信支付
    1.哪些人哪些账号，可以实现微信支付
        1.企业账号
        2.企业账号的小程序后台中， 必须给开发者 添加白名单
            1.一个appid 可以同时绑定多个开发者
            2.这些开发者就可以共用这个appid 和他的开发权限
3 支付按钮
  1 先判断缓存中有没有token
  2 没有 跳转到授权页面 进行获取token 
  3 有token 。。。
  4 创建订单 获取订单编号
  5 已经完成了微信支付
  6 手动删除缓存中 已经被选中了的商品 
  7 删除后的购物车数据 填充回缓存
  8 再跳转页面 
 */

//  引入封装好的获取收货地址
import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../requset/index.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: {},
        // 缓存中的购物车的信息
        cart: [],
        // 5 
        totalPrice: 0,
        totalNum: 0
    },
    onShow() {
        // 1.获取本地存储中的数据地址
        const address = wx.getStorageSync("address");
        // 3、.1. 获取缓存中的购物车的信息
        let cart = wx.getStorageSync("cart") || [];
        // 过滤后的购物车数组
        cart = cart.filter(v => v.checked)
        this.setData({ address });

        // 6. 从新计算 总价格、 总数量
        let totalPrice = 0;
        let totalNum = 0;
        cart.forEach(v => {
            totalPrice += v.num * v.goods_price;
            totalNum += v.num
        });
        this.setData({
            cart,
            totalPrice,
            totalNum,
            address
        });

        // let pages = getCurrentPages()
        // let currentpage = pages[pages.length - 1].options
        // console.log(currentpage)
        // const { type } = currentpage
        // this.getorders(type)
        wx.setStorageSync('token', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo')

    },


    // 点击支付
    async bangleOrderPay() {
        try {
            // 1.判断缓存中有没有token
            const token = wx.getStorageSync("token");
            console.log(token);
            // 2.判断
            if (!token) {
                wx.navigateTo({
                    url: '/pages/auth/index',
                });
                return;
            }
            // 3.创建订单
            // 3.1 准备 请求头参数
            // const header = { Authorization: token }
            // 3.2 准备请求体参数
            const order_price = this.data.totalPrice;
            const consignee_addr = this.data.cart;
            const cart = this.data.cart;
            let goods = [];
            cart.forEach(v => goods.push({
                goods_id: v.goods_id,
                goods_number: v.num,
                goods_price: v.goods_price
            }))
            const orderParams = { order_price, consignee_addr, goods };
            // 4.准备发送请求, 创建订单, 获取订单编号
            const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams });
            console.log(order_number);
            // 5 发起 预支付接口
            const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } });
            // 6 发起微信支付 
            await requestPayment(pay);
            // 7 查询后台 订单状态
            const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } });
            await showToast({ title: "支付成功" });
            // 8 手动删除缓存中 已经支付了的商品
            let newCart = wx.getStorageSync("cart");
            newCart = newCart.filter(v => !v.checked);
            wx.setStorageSync("cart", newCart);

            // 8 支付成功了 跳转到订单页面
            wx.navigateTo({
                url: '/pages/order/index'
            });

        } catch (error) {
            await showToast({ title: "支付失败" })
            console.log(error);
        }
    }
})