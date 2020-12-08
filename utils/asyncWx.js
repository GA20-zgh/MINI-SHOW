// 封装微信小程序的API
/**
 * Promise 形式的 getSetting
 * 获取权限状态
 */
export const getSetting=() =>{
    return new Promise((resolve, reject)=>{
        wx.getSetting({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
          
    })
}
/**
 * Promise 形式的 chooseAddress
 * 选择收货地址
 */
export const chooseAddress=() =>{
    return new Promise((resolve, reject)=>{
        wx.chooseAddress({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
          
    })
}
/**
 * Promise 形式的 openSetting
 * 打开授权页面
 */
export const openSetting=() =>{
    return new Promise((resolve, reject)=>{
        wx.openSetting({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
          
    })
}
// 判断是否要删除的弹窗提示
export const showModal=({content}) =>{
    return new Promise((resolve, reject)=>{
        wx.showModal({
            title:'提示',
            content:content,
            success:(res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
        });
          
    })
}

// Promise 形式的 showToast
export const showToast=({title}) =>{
    return new Promise((resolve, reject)=>{
        wx.showToast({
            title:title,
            icon:'none',
            success:(res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
        });
          
    })
}


// Promise 形式的 login
export const login=() =>{
    return new Promise((resolve, reject)=>{
        wx.login({
            timeout:10000,
            success:(result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
          
    })
}


// Promise 形式的 requestPayment
// 支付所必要的参数
export const requestPayment=(pay) =>{
    return new Promise((resolve, reject)=>{
      wx.requestPayment({
         ...pay,
         success:(result) => {
            resolve(result)
        },
        fail: (err) => {
            reject(err)
        }
      });
    })
}
