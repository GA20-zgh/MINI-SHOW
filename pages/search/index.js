/*
1. 输入框绑定 值不变事件， input 事件
    1.获取到输入框的值
    2.合法性判断
    3.检验通过， 把输入框的值发送到后台
    4.返回的数据打印到页面上

2. 防抖，（防止抖动）定时器    节流
    0. 防抖 一般 输入框中 防止重复输入， 重复发送请求
    0. 节流 一般是用在页面下拉和上拉
    1.定义一个全局定时器  id

 */

import { request } from "../../requset/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

    data: {
        goods:[],
        // 取消的按钮是否显示
        isFocus:false,
        // 输入框的值
        inpValue:""
    },
    TimeId:1,
    // 输入框的值的改变，就会触发的事件
    handleInput(e){
        // 1.获取输入框的值
        const {value} = e.detail;
        // 2.检测合法性
        if(!value.trim()){
            this.setData({
                goods:[],
                isFocus:false
            })
            // 值不合法
            return; 
        }
        // 3.准备发送请求获取数据
        this.setData({
            isFocus:true
        })
        clearTimeout(this.TimeId);
        this.TimeId = setTimeout(()=> {
            this.qsearch(value);
        },1000)
    },
    // 发送请求获取搜索建议的数据
    async qsearch(query){
        const res = await request({url:"/goods/qsearch",data:{query}});
        console.log(res);
        this.setData({
            goods:res
        })
    },
    // 点击按钮取消
    handleCancel(){
        this.setData({
            inpValue:"",
            isFocus:false,
            goods:[]
        })
    },

    /**
     * 生命周期函数--监听页面加载 
     */
    onLoad: function (options) {
       
    },

})