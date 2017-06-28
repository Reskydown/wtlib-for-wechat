// pages/storage/storage.js
Page({
  data: {
    carts: [
      { cid: 1008, title: 'Zippo打火机', image: '../../dist/img/timg.jpg', num: 1, price: '198.0', sum: '198.0', selected: true },
      { cid: 1012, title: 'iPhone7 Plus', image: 'https://img13.360buyimg.com/n7/jfs/t3235/100/1618018440/139400/44fd706e/57d11c33N5cd57490.jpg', num: 1, price: '7188.0', sum: '7188.0', selected: true },
      { cid: 1031, title: '得力订书机', image: 'https://img10.360buyimg.com/n7/jfs/t2005/172/380624319/93846/b51b5345/5604bc5eN956aa615.jpg', num: 3, price: '15.0', sum: '45.0', selected: false },
      { cid: 1054, title: '康师傅妙芙蛋糕', image: 'https://img14.360buyimg.com/n7/jfs/t2614/323/914471624/300618/d60b89b6/572af106Nea021684.jpg', num: 2, price: '15.2', sum: '30.4', selected: false },
      { cid: 1063, title: '英雄钢笔', image: 'https://img10.360buyimg.com/n7/jfs/t1636/60/1264801432/53355/bb6a3fd1/55c180ddNbe50ad4a.jpg', num: 1, price: '122.0', sum: '122.0', selected: false },
    ],
    minusStatuses: [],
    selectedAllStatus: false,
    total: 0,
  },
  getSum: function(){
    var total=0;
    var carts = this.data.carts;
    for (var i = 0; i < carts.length; i++) {
      var selected = carts[i].selected;
      if (selected == true)
        total += carts[i].num;
    }
    this.setData({
      total : total
    });
  },
  onReady: function(){
    this.getSum();
  },
  bindMinus: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var num = this.data.carts[index].num;
    // 如果只有1件了，就不允许再减了
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 购物车数据
    var carts = this.data.carts;
    carts[index].num = num;
    // 按钮可用状态
    var minusStatuses = this.data.minusStatuses;
    minusStatuses[index] = minusStatus;
    // 将数值与状态写回
    this.setData({
      carts: carts,
      minusStatuses: minusStatuses
    });
     this.getSum();
  },
  bindPlus: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var num = this.data.carts[index].num;
    // 自增
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 购物车数据
    var carts = this.data.carts;
    carts[index].num = num;
    // 按钮可用状态
    var minusStatuses = this.data.minusStatuses;
    minusStatuses[index] = minusStatus;
    // 将数值与状态写回
    this.setData({
      carts: carts,
      minusStatuses: minusStatuses
    });
     this.getSum();
  },
  deleteDom: function () {
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].selected==true) {
        this.data.carts.splice(i,1);
        //因为数组会更新，即第二个数据下标变成0
        i=i-1;
      }
    }
    this.setData({
      carts: this.data.carts
    });
     this.getSum();
  },
  bindCheckbox: function (e) {
    wx.showToast({
      title: '操作中',
      mask: true
    });
    var index = parseInt(e.currentTarget.dataset.index);
    //原始的icon状态
    var selected = this.data.carts[index].selected;
    var carts = this.data.carts;
    if (selected == true)
      carts[index].selected = false;
    else
      carts[index].selected = true;
    // 写回经点击修改后的数组
    this.setData({
      carts: carts,
    });
     this.getSum();
    wx.hideToast();
  },
  bindSelectAll: function () {
    wx.showToast({
      title: '操作中',
      mask: true
    });
    // 环境中目前已选状态
    var selectedAllStatus = this.data.selectedAllStatus;
    // 取反操作
    selectedAllStatus = !selectedAllStatus;
    // 购物车数据，关键是处理selected值
    var carts = this.data.carts;
    // 遍历
    for (var i = 0; i < carts.length; i++) {
      carts[i].selected = selectedAllStatus;
    }
    wx.hideToast();
    this.setData({
      selectedAllStatus: selectedAllStatus,
      carts: carts,
    });
 this.getSum();
  }
})