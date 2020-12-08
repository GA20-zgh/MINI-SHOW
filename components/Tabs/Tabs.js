// components/Tabs/Tabs.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 要接受的父元素的数据
        tabs:{
            type:Array,
            value:[]
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 点击事件
        handleItemTap(e){
            // 1.获取点击到的索引
            // console.log(e);
            const {index} = e.currentTarget.dataset;
            // 2.触发父组件的自定义组件 
            this.triggerEvent('tabsItemChange', {index})
        }
    }
})
