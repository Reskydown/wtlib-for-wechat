Page({
  data: {
    container: "disp-block",
    search: "disp-flex",
    head: "disp-none",
    info: "disp-none",
    book_list: [{}]
  },
  onReady: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
    })
    var that = this;
    wx.request({
      url: 'http://127.0.0.1:8080/wtlib-web/get/book',//上线的话必须是https，没有appId的本地请求貌似不受影响 
      header: {
        'content-type': 'application/json'
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      success: function (res) {
        wx.hideToast();
        console.log(res.data.data);
        that.setData({
          book_list: res.data.data
        });
        console.log(that.data.book_list[0]);
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
  show: function () {
    this.setData({
      container: "disp-none",
      search: "disp-none",
      head: "disp-flex",
      info: "disp-block"
    })
  },
  hidden: function () {
    this.setData({
      container: "disp-block",
      search: "disp-flex",
      head: "disp-none",
      info: "disp-none"
    })
  }
})