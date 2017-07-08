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
    title:"",
    //为了区分搜索和显示全页
    url: "http://127.0.0.1:8080/wtlib-web/get/book"
  },
  onReady: function () {
    var that = this;
    load_data(that)
  },
  scan_photo: function () {
    wx.scanCode({
      success: (res) => {
        console.log(res.result)
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },
  show: function (e) {
    this.setData({
      container: "disp-none",
      search: "disp-none",
      head: "disp-flex",
      info: "disp-block"
    })
    var index = parseInt(e.currentTarget.dataset.index);
    var id = this.data.book_list[index].id;
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
    load_label(that,id)
  },
  hidden: function () {
    this.setData({
      container: "disp-block",
      search: "disp-flex",
      head: "disp-none",
      info: "disp-none"
    })
  },
  search_input:function(e){
    this.setData({
      title: e.detail.value
    })
  },
  find:function(){
    this.setData({
      book_list: [{}],
      url: "http://127.0.0.1:8080/wtlib-web/find/book",
      page_index:0,
    })
    var that = this;
    load_data(that);
  },
  load_book: function () {
    var that = this;
    load_data(that);
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
  var page_index = that.data.page_index+1;
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
var load_label = function (that,id){
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
    data: { pageIndex: label_index,
      id: id
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
          label_list: res.data.data,
          label_index: label_index
        });
      }
      else {
        wx.showToast({
          title: res.data.msg,
          icon:'success'
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