// pages/login/login.js
Page({
  data: {},
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  userNameInput: function (e) {
    this.setData({
      loginId: e.detail.value
    })
  },
  confirm: function () {
    if (this.data.loginId == null) {
      wx.showModal({
        title: "信息提示",
        content: "用户名不得为空，请输入用户名",
        showCancel: false,
      })
    }
    else if (this.data.password == null) {
      wx.showModal({
        title: "信息提示",
        content: "密码不得为空，请输入密码",
        showCancel: false,
      })
    } else {
      wx.showToast({
        title: '加载中',
        icon: 'loading'
      });
      var wx_id;
      wx.getStorage({
        key: "userInfo",
        fail: function (res) {
          wx.showModal({
            title: "请求失败",
            content: "服务器故障，正在维修中",
            showCancel: false,
          })
        },
        success: function (res) {
          console.log(res.data)
          console.log(res.data.city)
          wx_id = res.data.id
          console.log(wx_id)
        }
      });
      wx.request({
        url: 'http://127.0.0.1:8080/wtlib-web/login',//上线的话必须是https，没有appId的本地请求貌似不受影响 
        data: {
          loginId: this.data.loginId,
          password: this.data.password,
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
        success: function (res) {
          wx.hideToast();
          var code = res.data.code
          if (code == 10000) {
            var key = res.data.data;
            wx.setStorage({
              key: "key"
              , data: JSON.stringify(key)
            });
            //把微信用户和授权用户给绑定起来
            wx.request({
              url: 'http://127.0.0.1:8080/wtlib-web/update/auth',//上线的话必须是https，没有appId的本地请求貌似不受影响 
              data: {
                key: key,
                id: wx_id,
              },
              header: {
                'content-type': 'application/json'
              },
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
              success: function (res) {
                wx.hideToast();
                var code = res.data.code
                if (code == 10000) {
                  wx.redirectTo({ url: "/pages/home/home" });
                } else {
                  wx.showModal({
                    title: "登录失败",
                    content: res.data.msg,
                    showCancel: false,
                  })
                }
              },
              fail: function () {
                wx.hideToast();
                wx.showModal({
                  title: "请求超时",
                  content: "服务器故障，正在维修中",
                  showCancel: false,
                })
              }
            })
          } else {
            wx.showModal({
              title: "登录失败",
              content: "账号或密码错误，请重新填写",
              showCancel: false,
            })
          }
        },
        fail: function () {
          wx.hideToast();
          wx.showModal({
            title: "请求超时",
            content: "服务器故障，正在维修中",
            showCancel: false,
          })
        }
      })
    }
  }
})