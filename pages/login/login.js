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
  wechat_confirm: function () {
    wx.login({
      success: function (r) {
        var code = r.code;//登录凭证
        if (code) {
          //2、调用获取用户信息接口
          wx.getUserInfo({
            success: function (res) {
              console.log({ encryptedData: res.encryptedData, iv: res.iv, code: code })
              //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
              wx.request({
                url: 'http://127.0.0.1:8080/wtlib-web/confirm/auth',//自己的服务接口地址
                method: 'post',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: { encryptedData: res.encryptedData, iv: res.iv, code: code },
                success: function (data) {
                  //4.解密成功后 获取自己服务器返回的结果
                  if (data.data.status == 1) {
                    var userInfo_ = data.data.userInfo;
                    console.log(userInfo_)
                    wx.redirectTo({ url: "/pages/home/home" });
                  } else {
                    wx.showModal({
                      title: "请求超时",
                      content: "解密失败！",
                      showCancel: false,
                    })
                  }
                },
                fail: function () {
                  wx.showModal({
                    title: "请求超时",
                    content: "系统错误！",
                    showCancel: false,
                  })
                }
              })
            },
            fail: function () {
              wx.showModal({
                title: "请求超时",
                content: "获取用户登录态失败！",
                showCancel: false,
              })
            }
          })
        } else {
          wx.showModal({
            title: "请求超时",
            content: "获取用户登录态失败！" +r.errMsg,
            showCancel: false,
          })
        }
      },
      fail: function () {
        wx.showModal({
          title: "请求超时",
          content: "登陆失败",
          showCancel: false,
        })
      }
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
            var data = res.data.data;
            wx.setStorage({ "key": data });
            wx.redirectTo({ url: "/pages/home/home" });
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