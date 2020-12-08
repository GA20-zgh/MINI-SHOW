/*
 1. 点击“+” 触发 tap 点击事件
    1.调用小程序内置的 选择图片的api
    2.获取到 图片的路径 数组
    3.把图片路径存到 data的变量中
    4.页面就可以根据 图片数组 进行循环显示， 自定义组件

2. 点击 自定义图片 组件
    1.获取被点击的元素的索引
    2.获取data 中的图片数组
    3.根据索引 数组，删除对应的元素
    4.把数组重新设置回data中

3. 点击提交
    1.获取文本域的内容
        1.data 中定义变量， 表示输入框的内容
        2.文本域 绑定 输入事件，事件触发的时候，把输入框的值，存入到变量中
    2.对这些内容 合法性验证
    3.验证通过， 用户选中图片， 上传到专门的图片服务器， 返回图片外网的链接
        1.变量数组
        2.挨个上传
        3.自己再维护一个数组，存放 图片上传后到外网的链接
    4.文本域 和外网的图片路径， 一起提交到服务器，  前端的模拟， 不会发送请求到后台
    5.清空当前页面
    6.返回上一页
*/
Page({

    data: {
        tabs: [
            {
                id: 0,
                value: "体验问题",
                isActive: true
            },
            {
                id: 1,
                value: "商品、商家投诉",
                isActive: false
            }
        ],
        // 被选中的图片路径 数组
        chooseImgs: [],
        // 文本域的内容
        textVal: ""
    },
    // 外网的图片的路径数组
    UpLoadImgs: [],
    // 标题的点击事件, 从子组件传递过来的
    handleTabsItemChange(e) {
        // console.log(e);
        // 1.获取点击的索引
        const { index } = e.detail;
        // 2.修改源数组
        let { tabs } = this.data;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        // 3.赋值到data中
        this.setData({
            tabs
        })
    },
    // 点击"+" 选中图片
    handleChooseImg() {
        // 2.调用小程序内部的选中图片的api
        wx.chooseImage({
            // 同时选中的图片的数量
            count: 9,
            // 图片的格式，原图，压缩
            sizeType: ['original', 'compressed'],
            // 图片的来源 相册、哲照相机
            sourceType: ['album', 'camera'],
            success: (result) => {
                // console.log(result);
                this.setData({
                    // chooseImgs:result.tempFilePaths
                    // 图骗数组 进行拼接
                    chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
                })
            }
        })
    },
    // 点击的自定义图片组件
    bindleRemoveImg(e) {
        // 2.获取被点击的组件的索引
        // console.log(e);
        const { index } = e.currentTarget.dataset;
        // console.log(index);
        // 3.获取data 中的图片数组
        let { chooseImgs } = this.data;
        // 4.删除元素
        chooseImgs.splice(index, 1);
        this.setData({
            chooseImgs
        })
    },
    // 文本域的输入事件
    handleTextInput(e) {
        this.setData({
            textVal: e.detail.value
        })
    },
    // 提交按钮的点击
    handleFormSubmit() {
        // 1 获取文本域的内容 图片数组
        const { textVal, chooseImgs } = this.data;
        // 2 合法性的验证
        if (!textVal.trim()) {
            // 不合法
            wx.showToast({
                title: '输入不合法',
                icon: 'none',
                mask: true
            });
            return;
        }
        // 3 准备上传图片 到专门的图片服务器 
        // 上传文件的 api 不支持 多个文件同时上传  遍历数组 挨个上传 
        // 显示正在等待的图片
        wx.showLoading({
            title: "正在上传中",
            mask: true
        });

        // 判断有没有需要上传的图片数组

        if (chooseImgs.length != 0) {
            chooseImgs.forEach((v, i) => {
                wx.uploadFile({
                    // 图片要上传到哪里
                    url: 'https://images.ac.cn/Home/Index/UploadAction/',
                    // url: 'img.coolcr.cn/index/api.html',
                    // 被上传的文件的路径
                    filePath: v,
                    // 上传的文件的名称 后台来获取文件  file
                    name: "file",
                    // name:"image",
                    // 顺带的文本信息
                    formData: {},
                    success: (result) => {
                        console.log(result);
                        let url = JSON.parse(result.data).url;
                        this.UpLoadImgs.push(url);

                        // 所有的图片都上传完毕了才触发  
                        if (i === chooseImgs.length - 1) {

                            wx.hideLoading();


                            console.log("把文本的内容和外网的图片数组 提交到后台中");
                            //  提交都成功了
                            // 重置页面
                            this.setData({
                                textVal: "",
                                chooseImgs: []
                            })
                            // 返回上一个页面
                            wx.navigateBack({
                                delta: 1
                            });

                        }
                    }
                });
            })
        } else {
            wx.hideLoading();

            console.log("只是提交了文本");
            wx.navigateBack({
                delta: 1
            });

        }
    }

})