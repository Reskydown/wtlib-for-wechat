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
    my_advice:"disp-none"
  },
  show_container: function(){
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
      head: "借阅历史",
    })
  },
  show_back:function () {
    this.setData({
      return_back: "disp-block",
      container: "disp-none",
      icon_back: "disp-block",
      user_head: "借阅归还"
    })
  },
  show_reservation: function () {
    this.setData({
      reservation: "disp-block",
      container: "disp-none",
      icon_back: "disp-block",
      user_head: "我的预约"
    })
  },
  show_advice: function () {
    this.setData({
      advice: "disp-block",
      container: "disp-none",
      history:"disp-none",
      icon_back: "disp-block",
      user_head: "评价界面"
    })
  },
  show_me: function(){
    this.setData({
      my_advice: "disp-flex",
      container: "disp-none",
      icon_back: "disp-block",
      user_head: "我的评价"
    })
  }
})