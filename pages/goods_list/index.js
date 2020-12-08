// 0 引入用发送请求的方法, 要把路径补全
import { request } from "../../requset/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
/*
1.用户上滑页面， 滚动条触底， 开始加载下一页数据
    1.找到滚动条触底事件 微信小程序官方开发文档
    2.判断还有没有下一页数据
        1.获取到总页数 ， 总条数：total
            总页数 = Math.ceil(总条数/爷容量)
        2.获取到当前的页码  pagenum
        3.判断一下，当前的页码是否大于等于总页数 ， 表示没有页数了
    3.假如没有下一页数据， 弹出一个提示
    4。加入还有下一页数据，加载下一页数据
        1.当前的页码 ++
        2.重新发送请求
        3.数据请求回来 要对data中的数组进行拼接， 而不是全部替换
 */
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs:[
            {
                id:0,
                value:"综合",
                isActive:true
            },
            {
                id:1,
                value:"销量",
                isActive:false
            },
            {
                id:2,
                value:"价格",
                isActive:false
            }
        ],
        //获取的商品列表
        goodsList:[]
    },
    // 接口要的参数
    QueryParams:{
        query:"",
        cid:"",
        pagenum:1,
        pagesize:10
    },
    // 总页数
    totalPages:1,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(options);
        this.QueryParams.cid = options.cid || " ";
        this.QueryParams.query = options.query || " ";
        this.getGoodsList();
    },
    // 获取商品列表数据
    async getGoodsList(){
        const res = await request({url:'/goods/search',data:this.QueryParams});
        // console.log(res);
        // 获取总条数
        const total = res.total
        // 获取总页数
        this.totalPages = Math.ceil( total /this.QueryParams.pagesize);
        this.setData({
            // 拼接数组
            goodsList :[...this.data.goodsList,...res.goods]
        })
        // 关闭下拉刷新的窗口, 如果没有调用下拉刷新窗口， 直接关闭也不会报错
        wx.stopPullDownRefresh();

    },
    // 标题的点击事件, 从子组件传递过来的
    handleTabsItemChange(e){
        // console.log(e);
        // 1.获取点击的索引
        const {index} = e.detail;
        // 2.修改源数组
        let {tabs} = this.data;
        tabs.forEach((v, i) =>i === index? v.isActive=true:v.isActive=false);
        // 3.赋值到data中
        this.setData({
            tabs
        })
    },
    // 页面上滑， 滚动条触底事件
    onReachBottom(){
        // console.log("页面到底了");
        // 判断还有没有下一页数据
        if(this.QueryParams.pagenum >= this.totalPages){
            // 没有下一页
            console.log("没有下一页数据");
        } else{
            this.QueryParams.pagenum ++ ;
            this.getGoodsList();
        }
    },
    // 下拉刷新事件
    /*
    1.触底下来刷新事件 需要在页面的json 文件中开启一个配置项, 找到下拉触发刷新的数据
    2.重置数据数组
    3.重置页码， 设置为1
    4.重新发送亲求
     */
    onPullDownRefresh(){
        // 1.重置数组
        this.setData({
            goodsList:[]
        })
        // 2.重置页码
        this.QueryParams.pagenum =1;
        // 3.重新发送亲求
        this.getGoodsList();
    }
})