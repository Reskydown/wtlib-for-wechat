Page({
  data: {
    history: "disp-none",
    container: "disp-flex",
    icon_back: "disp-none",
    advice: "disp-none",
    reservation: "disp-none",
    return_back: "disp-none",
    icon_check: "disp-none",
    user_head: "用户中心",
    my_advice: "disp-none",
    user_info: {},
    center_info: {},
    recoder_index: 1,
    recoder_list: [],
    reservation_index:1,
    reservation_list:[],
    label_index:1,
    label_list:[],
    advice_list:{},
    value:""
  },
  show_container: function () {
    this.setData({
      history: "disp-none",
      container: "disp-flex",
      icon_back: "disp-none",
      advice: "disp-none",
      reservation: "disp-none",
      return_back: "disp-none",
      icon_check: "disp-none",
      user_head: "用户中心",
      my_advice: "disp-none"
    })
  },
  show_history: function () {
    this.setData({
      history: "disp-flex",
      container: "disp-none",
      icon_back: "disp-block",
      user_head: "借阅历史",
      recoder_index: 1,
      recoder_list: []
    })
    this.load_history();
  },
  show_back: function () {
    this.setData({
      return_back: "disp-block",
      container: "disp-none",
      icon_back: "disp-block",
      user_head: "借阅归还",
      recoder_index: 1,
      recoder_list: []
    })
    var that = this;
    this.load_back();
  },
  show_reservation: function () {
    this.setData({
      reservation: "disp-block",
      container: "disp-none",
      icon_back: "disp-block",
      user_head: "我的预约",
      reservation_index: 1,
      reservation_list: []
    })
    this.load_reservation();
  },
  area_change:function(e){   
    this.setData({
      value:e.detail.value
    })
  },
  show_advice: function (e) {
    this.setData({
      advice: "disp-block",
      container: "disp-none",
      history: "disp-none",
      icon_back: "disp-block",
      user_head: "评价界面",
      icon_check: "disp-block"
    })
    var index = parseInt(e.currentTarget.dataset.index);
    var list = this.data.recoder_list[index];
    this.setData({
       advice_list:this.data.recoder_list[index]
    })
  },
  confirm_advice: function(){
    var that = this;
    wx.showModal({
      title: "友情提示",
      content: "请确认是否提交",
      success: function (res) {
        if (res.confirm) {
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
            success: function (key) {
              wx.request({
                url: 'http://127.0.0.1:8080/wtlib-web/add/label',//自己的服务接口地址
                method: 'post',
                data: {
                  key: key.data, value: that.data.value, infoId: that.data.advice_list.bookBaseId, recordId: that.data.advice_list.id
                },
                success: function (data) {
                  if (code == 10000) {
                    wx.showToast({
                      title: data.data.msg,
                      icon: 'success'
                    })
                  }
                  else
                    wx.showModal({
                      title: "请求超时",
                      content: data.data.data,
                      showCancel: false,
                    })
                },
                fail: function () {
                  wx.showModal({
                    title: "请求超时",
                    content: "系统错误！",
                    showCancel: false,
                  })
                }
              })
            }
          })
        }
      }
    })
  },
  show_me: function () {
    this.setData({
      my_advice: "disp-flex",
      container: "disp-none",
      icon_back: "disp-block",
      user_head: "我的评价",
      label_index: 1,
      label_list: []
    })
    this.load_label()
  },
  scan_back: function(){
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
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
          success: function (key) {
            wx.request({
              url: 'http://127.0.0.1:8080/wtlib-web/update/back' + res.result,//自己的服务接口地址
              method: 'post',
              data: {
                key: key.data
              },
              success: function (data) {
                var code = data.data.code;
                if (code == 10000) {
                  wx.showToast({
                    title: data.data.msg,
                    icon: 'success'
                  })
                }
                else
                  wx.showModal({
                    title: "请求超时",
                    content: data.data.data,
                    showCancel: false,
                  })
              },
              fail: function () {
                wx.showModal({
                  title: "请求超时",
                  content: "系统错误！",
                  showCancel: false,
                })
              }
            })
          }
        })
      }
    })
  },
  onReady: function () {
    var that = this;
    //在这里面ajax必须是同步的，因为wx.request不支持同步，所以只有把逻辑写在success里面
    wechat_confirm(that);
  },
   cancel_reservation:function(e){
    var that = this;
    wx.showModal({
      title: "友情提示",
      content: "是否要取消预约？！",
      success:function(res){
        if (res.confirm) {
          var index = parseInt(e.currentTarget.dataset.index);
          var id = that.data.reservation_list[index].id;
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
            success: function (key) {
              wx.request({
                url: 'http://127.0.0.1:8080/wtlib-web/cancel/reservation',//自己的服务接口地址
                method: 'post',
                data: {
                  key: key.data, id: id
                },
                success: function (data) {
                  var code = data.data.code;
                  that.setData({
                    label_index: that.data.label_index + 1
                  })
                  if (code == 10000) {
                    wx.showToast({
                      title: data.data.msg,
                      icon: 'success'
                    })
                  }
                  else
                    wx.showToast({
                      title: data.data.msg,
                      icon: 'success'
                    })
                },
                fail: function () {
                  wx.showModal({
                    title: "请求超时",
                    content: "系统错误！",
                    showCancel: false,
                  })
                }
              })
            }
          })
        }
      }
    })
  },
  load_back: function(){
    var that = this;
    get_record(that, "back");
  },
  load_history: function () {
    var that = this;
    get_record(that, "recoder");
  },
  load_reservation: function() {
    var that = this;
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
      success: function (key) {
        wx.request({
          url: 'http://127.0.0.1:8080/wtlib-web/get/reservation',//自己的服务接口地址
          method: 'post',
          data: {
            key: key.data, pageIndex: that.data.reservation_index
          },
          success: function (data) {
            var code = data.data.code;
            that.setData({
              reservation_index: that.data.reservation_index + 1
            })
            if (code == 10000) {
              that.setData({
                reservation_list: data.data.data.concat(that.data.reservation_list)
              })
              wx.showToast({
                title: data.data.msg,
                icon: 'success'
              })
            }
            else
              wx.showToast({
                title: data.data.msg,
                icon: 'success'
              })
          },
          fail: function () {
            wx.showModal({
              title: "请求超时",
              content: "系统错误！",
              showCancel: false,
            })
          }
        })
      }
    })
  },
  load_label: function () {
    var that = this;
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
      success: function (key) {
        wx.request({
          url: 'http://127.0.0.1:8080/wtlib-web/get/label',//自己的服务接口地址
          method: 'post',
          data: {
            key: key.data, pageIndex: that.data.label_index
          },
          success: function (data) {
            var code = data.data.code;
            that.setData({
              label_index: that.data.label_index + 1
            })
            if (code == 10000) {
              that.setData({
                label_list: data.data.data.concat(that.data.label_list)
              })
              wx.showToast({
                title: data.data.msg,
                icon: 'success'
              })
            }
            else
              wx.showToast({
                title: data.data.msg,
                icon: 'success'
              })
          },
          fail: function () {
            wx.showModal({
              title: "请求超时",
              content: "系统错误！",
              showCancel: false,
            })
          }
        })
      }
    })
  }
})
//这里是为了防止用户更新用户信息。
var wechat_confirm = function (that) {
  wx.login({
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
              dataType: "json",
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: { encryptedData: res.encryptedData, iv: res.iv, code: code },
              success: function (data) {
                //4.解密成功后 获取自己服务器返回的结果
                var code = data.data.code
                if (code == 10000) {
                  var info = data.data.data;
                  wx.setStorage({
                    key: "userInfo",
                    data: info
                  });
                  if (info.userId == null) {
                    //则他没有借阅书籍预约书籍逾期这些，统统设为0，预约也没有。
                    that.setData({
                      center_info: { borrow: 0, overTime: 0, reservation: 0, credit: 0 }
                    })
                  } else {
                    get_center(that);
                  }
                  that.setData({
                    user_info: info,
                  })
                } else {
                  wx.showModal({
                    title: "请求超时",
                    content: data.data.data,
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
var get_center = function (that) {
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
    success: function (key) {
      wx.request({
        url: 'http://127.0.0.1:8080/wtlib-web/get/center',//自己的服务接口地址
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: { key: key.data },
        success: function (data) {
          var code = data.data.code;
          if (code == 10000)
            that.setData({
              center_info: data.data.data
            })
          else
            wx.showModal({
              title: "请求超时",
              content: data.data.data,
              showCancel: false,
            })
        },
        fail: function () {
          wx.showModal({
            title: "请求超时",
            content: "系统错误！",
            showCancel: false,
          })
        }
      })
    }
  })
}
var get_record = function(that,url){
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
    success: function (key) {
      wx.request({
        url: 'http://127.0.0.1:8080/wtlib-web/get/'+url,//自己的服务接口地址
        method: 'post',
        data: {
          key: key.data, pageIndex: that.data.recoder_index
        },
        success: function (data) {
          var code = data.data.code;
          that.setData({
            recoder_index: that.data.recoder_index + 1
          })
          if (code == 10000) {
            for (var i = 0; i < data.data.data.length; i++) {
              var newDate = new Date();
              var time = data.data.data[i].borrowDeadLine;
              var back_date = data.data.data[i].borrowTime;
              newDate.setTime(time);
              data.data.data[i].borrowDeadLine = newDate.toLocaleDateString();
              newDate.setTime(back_date);
              data.data.data[i].borrowTime = newDate.toLocaleDateString();
            }
            that.setData({
              recoder_list: data.data.data.concat(that.data.recoder_list)
            })
            wx.showToast({
              title: data.data.msg,
              icon: 'success'
            })
          }
          else
            wx.showModal({
              title: "请求超时",
              content: data.data.data,
              showCancel: false,
            })
        },
        fail: function () {
          wx.showModal({
            title: "请求超时",
            content: "系统错误！",
            showCancel: false,
          })
        }
      })
    }
  })
}