Page({
  data: {
    container: "disp-block",
    search: "disp-flex",
    head: "disp-none",
    info: "disp-none",
    book: "disp-none",
    book_list: [{}],
    book_single: {},
    label_list: [{}],
    page_index: 0,
    has_refresh: true,
    label_index: 0,
    title: "",
    //为了区分搜索和显示全页
    url: "http://127.0.0.1:8080/wtlib-web/get/book",
    //为了记录当前list的id
    recent_id:0
  },
  onReady: function () {
    var that = this;
    load_data(that)
  },
  reservate: function () {
    wx.getStorage({
      key: "userInfo",
      fail: function (res) {
        wechat_confirm();
      },
      success: function (res){
        wx.getStorage({
          key: 'key',
          fail: function (res) {
            wx.showModal({
              title: "请求失败",
              content: "您不是内部人员，没有这个权限,是否登录？",
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({ url: "/pages/login/login" });
                }
              }
            })
          },
          success: function (data){
            wx.scanCode({
              onlyFromCamera: true,
              success: (res) => {
                wx.request({
                  url: 'http://127.0.0.1:8080/wtlib-web/update/borrow',//上线的话必须是https，没有appId的本地请求貌似不受影响 
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  data: {
                    "key": data.data, 
                    "bookHash": res.result },
                  method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
                  success: function (res) {
                    wx.hideToast();
                    if (res.data.code == 10000) {
                      that.setData({
                        book_single: res.data.data.book,
                        book: "disp-block"
                      });
                    }
                    else {
                      wx.showModal({
                        title: "请求超时",
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
              },
              fail: (res) => {
                return false;
                wx.showModal({
                  title: "扫码失败",
                  content: res,
                  showCancel: false,
                })
              }
            })
          }
        });
      }
    });
  },
  borrow: function () {
    var status = scan_photo();
    if (status != false) {

    }
  },
  show: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var id = this.data.book_list[index].id;
    this.setData({
      container: "disp-none",
      search: "disp-none",
      head: "disp-flex",
      info: "disp-block",
      recent_id: id,
      label_index:0,
      label_list:[]
    })
    var that = this;
    wx.request({
      url: 'http://127.0.0.1:8080/wtlib-web/get/support',//上线的话必须是https，没有appId的本地请求貌似不受影响 
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { "id": id },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      success: function (res) {
        wx.hideToast();
        if (res.data.code == 10000) {
          that.setData({
            book_single: res.data.data.book,
            book: "disp-block"
          });
        }
        else {
          wx.showModal({
            title: "请求超时",
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
    get_label(that)
  },
  hidden: function () {
    this.setData({
      container: "disp-block",
      search: "disp-flex",
      head: "disp-none",
      info: "disp-none"
    })
  },
  search_input: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  find: function () {
    this.setData({
      book_list: [{}],
      url: "http://127.0.0.1:8080/wtlib-web/find/book",
      page_index: 0,
    })
    var that = this;
    load_data(that);
  },
  load_book: function () {
    var that = this;
    load_data(that);
  },
  load_label: function () {
    var that = this;
    get_label(that);
  },
})
var load_data = function (that) {
  wx.showToast({
    title: '获取数据中…',
    icon: 'loading',
  });
  if (!that.data.has_refresh) {
    return;
  }
  that.data.has_refresh = false;//阻塞标识符，防止本次处理未结束前出现重复请求
  var page_index = that.data.page_index + 1;
  var title = that.data.title;
  wx.request({
    url: that.data.url,//上线的话必须是https，没有appId的本地请求貌似不受影响 
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
    data: { pageIndex: page_index, bookTitle: title },
    success: function (res) {
      if (res.data.code == 10000) {
        that.setData({
          book_list: res.data.data.concat(that.data.book_list),
          book: "disp-block",
          page_index: page_index
        });
      }
      else {
        wx.showToast({
          title: res.data.msg,
          icon: 'success'
        })
      }
    },
    fail: function () {
      wx.showModal({
        title: "请求超时",
        content: "服务器故障，正在维修中",
        showCancel: false,
      })
    }
  })
  that.data.has_refresh = true;//释放阻塞
  wx.hideToast();
}
var get_label = function (that) {
  wx.showToast({
    title: '获取数据中…',
    icon: 'loading',
  });
  if (!that.data.has_refresh) {
    return;
  }
  that.data.has_refresh = false;//阻塞标识符，防止本次处理未结束前出现重复请求
  var label_index = that.data.label_index + 1;
  wx.request({
    url: 'http://127.0.0.1:8080/wtlib-web/get/label/info',//上线的话必须是https，没有appId的本地请求貌似不受影响 
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
    data: {
      pageIndex: label_index,
      id: that.data.recent_id
    },
    success: function (res) {
      wx.hideToast();
      console.log(res)
      if (res.data.code == 10000) {
        for (var i = 0; i < res.data.data.length; i++) {
          var newDate = new Date();
          var time = res.data.data[i].createTime;
          newDate.setTime(time);
          res.data.data[i].createTime = newDate.toLocaleDateString();
        }
        that.setData({
          label_list: res.data.data.concat(that.data.label_list),
          label_index: label_index
        });
      }
      else {
        wx.showToast({
          title: res.data.msg,
          icon: 'success'
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
  that.data.has_refresh = true;//释放阻塞
}
var wechat_confirm = function () {
  wx.login({
    dataType: "json",
    success: function (r) {
      var code = r.code;//登录凭证
      if (code) {
        //2、调用获取用户信息接口
        wx.getUserInfo({
          success: function (res) {
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
                var code = data.data.code
                console.log(data);
                if (code == 10000) {
                  var user_info = data.data.data;
                  wx.setStorage({
                    key: "userInfo",
                    data: user_info
                  });
                  var id = user_info.userId;
                  wx.request({
                    url: 'http://127.0.0.1:8080/wtlib-web/get/key',//上线的话必须是https，没有appId的本地请求貌似不受影响 
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                      userId: id,
                    },
                    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
                    success: function (res) {
                      var code = res.data.code
                      if (code == 10000) {
                        var key = res.data.data;
                        if (key != null) {
                          wx.setStorage({
                            key: "key",
                            data: key
                          });
                          wx.showToast({
                            title: '成功',
                            icon: 'success',
                            duration: 2000
                          })
                        } else {
                          wx.navigateTo({ url: "/pages/login/login" });
                        }
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
              title: "警告",
              content: "您点击了拒绝授权，将无法正常使用正常的功能体验。请10分钟后再次点击授权，或者删除小程序重新进入。",
              showCancel: false,
            })
          }
        })
      } else {
        wx.showModal({
          title: "请求超时",
          content: "获取用户登录态失败！" + r.errMsg,
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
}