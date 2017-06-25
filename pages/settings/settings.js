Page({
  data: {
    items: [
      {name: '0', value: '男',checked: 'true'},
      {name: '1', value: '女'}
    ]
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  }
})