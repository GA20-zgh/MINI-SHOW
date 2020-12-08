// 0 引入用发送请求的方法, 要把路径补全
import { request } from "../../requset/index.js";
//Page Object
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航 数组
    catesList: [],
    // 楼层数据
    floorList: []
  },
  //页面开始加载，就会触发
  onLoad: function (options) {
    // 发起异步请求获取轮播图数据
    // 1 发送异步请求获取轮播图数据  优化的手段可以通过es6的 promise来解决这个问题 
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   }
    // });

    // request({ url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata' }).then(result => {
    //   this.setData({
    //     swiperList: result.data.message
    //   })
    // })

    this.getSwiperList();
    this.getCatesListt();
    this.getFloorList();
  },
  // 获取轮播图数据
  getSwiperList() {
    request({ url: '/home/swiperdata' }).then(result => {
      result.forEach((v, i) => { result[i].navigator_url = v.navigator_url.replace('main', 'index'); });
      this.setData({
        swiperList: result
      })
    })
  },
  // 获取导航数据
  getCatesListt() {
    request({ url: '/home/catitems' }).then(result => {
      this.setData({
        catesList: result
      })
    })
  },
  // 获取楼层数据
  getFloorList() {
    request({ url: '/home/floordata' }).then(result => {
      for (let k = 0; k < result.length; k++) {
        result[k].product_list.forEach((v, i) => {
          result[k].product_list[i].navigator_url = v.navigator_url.replace('?','/index?');
        });
      }
      // console.log(result);
      this.setData({
        floorList: result
      })
    })
  }
});
