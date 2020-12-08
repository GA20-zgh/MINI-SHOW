// 0 引入用发送请求的方法, 要把路径补全
import { request } from "../../requset/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
// pages/category/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 左侧数据
        leftList: [],
        // 右侧数据
        rightList: [],
        // 被点中的左侧菜单
        curretIndex: 0,
        // 右侧滚动条距离顶部的距离
        scrollTop: 0
    },
    // 分类数据
    Cates: [],

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        /*
        web 中的本地存储 和 小程序中的本地存储的区别
         1.代码方式：
            web: 存： localStorage.setItem("key", "value")  取： localStorage.getItem("key") 
            小程序： 存： wx.setStorageSync("key", "value"); 取： wx.getStorageSync("key");
        2.存的时候， 有没有做类型转换
            web： 不管存入的是什么类型的数据， 最终都会先调用以下 toString(), 把数据变成字符串， 在存进去
            小程序： 不存在数据类型转换这个操作， 存什么类型的数据进去， 获取的时候就是什么类型
        */
        // 1.先判断，本地存储有没有旧的数据
        // {time:data.now(),data:[...]}
        // 2.没有旧的数据， 直接发送请求
        // 3.有旧的数据， 同时旧的数据没有过期，就直接使用本地存储中的旧数据

        // 1.获取本地存储的数据（小程序中也是村小组本地存储技术）
        const Cates = wx.getStorageSync("cates");
        // 2.判断
        if (!Cates) {
            //不存在， 发数据亲求
            this.getCates();
        } else {
            // 有旧的数据， 定义过期的时间
            if (Date.now() - Cates.time > 1000 * 10) {
                // 从新发送请求
                this.getCates();
            } else {
                //可以使用旧的数据
                // console.log("可以使用旧的数据");
                this.Cates = Cates.data;
                let leftList = this.Cates.map(v => v.cat_name);
                let rightList = this.Cates[0].children;
                this.setData({
                    leftList,
                    rightList
                })
            }
        }
        this.getCates();
    },
    // 获取分类数据
    async getCates() {
        // request({ url: '/categories'}).then(res => {
        //     this.Cates = res.data.message;
        //     // 把接口的数据存入本地存储中
        //     wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});

        //     // 构造左侧大菜单数据
        //     let leftList = this.Cates.map(v=> v.cat_name);
        //     // 构造右侧大菜单数据
        //     let rightList = this.Cates[0].children;
        //     this.setData({
        //         leftList,
        //         rightList
        //     })
        // })
        const res = await request({ url: "/categories" });
        this.Cates = res;
        // 把接口的数据存入本地存储中
        wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

        // 构造左侧大菜单数据
        let leftList = this.Cates.map(v => v.cat_name);
        // 构造右侧大菜单数据
        let rightList = this.Cates[0].children;
        this.setData({
            leftList,
            rightList
        })
    },
    // 左侧菜单的点击事件
    handleItemTap(e) {
        // console.log(e);
        // 1.获取点击的标题的索引
        const { index } = e.currentTarget.dataset;
        // 2.给data 的currentIndex 赋值
        // 3.根据不同的索引渲染右侧的商品内容
        let rightList = this.Cates[index].children;
        this.setData({
            currentIndex: index,
            rightList,
            // 从新设置右侧的scroll-view 标签距离顶部的距离 
            scrollTop: 0
        })
    }
})