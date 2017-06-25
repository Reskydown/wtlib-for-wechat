Page({
  data:{
    container:"disp-block",
    search:"disp-flex",
    head:"disp-none",
    info:"disp-none"
  },
  show: function(){
    this.setData({
      container:"disp-none",
      search:"disp-none",
      head:"disp-flex",
      info:"disp-block"
    })
  },
  hidden: function(){
    this.setData({
      container:"disp-block",
      search:"disp-flex",
      head:"disp-none",
      info:"disp-none"
    })
  }
})