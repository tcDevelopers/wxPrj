function SQLQuery(sql, callback1, callback2) {
  console.log("开始网络请求..");
  //获取距离较近的小区清单
  wx.request({
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    url: 'https://www.meafe.cn/wx/SQLQuery',
    data: { sql: sql, randnum: Math.random() + '' },
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    success: function (res) {
      console.log("http success");
      var obj = res.data;
      if (callback1)
        callback1(obj);
    },
    fail: function (res) {
      console.log("http fail");
      if (callback2)
        callback2(res);
    },
    complete: function () {

    }
  })
}

function SQLEdit(sql, callback1, callback2) {
  //获取距离较近的小区清单
  wx.request({
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    url: 'https://www.meafe.cn/wx/ajax/sql_edit.jsp',
    data: { sql: sql, randnum: Math.random() + '' },
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    success: function (res) {
      console.log("http success");
      var obj = res.data;
      if (callback1)
        callback1(obj);
    },
    fail: function (res) {
      console.log("http fail");
      if (callback2)
        callback2(res);
    },
    complete: function () { }
  })
}

function SQLUpdate(URL, dataMap, tableName, whereCause, callback) {
  dataMap["tableName"] = tableName;
  dataMap["randnum"] = Math.random() + '';
  if (whereCause != null)
    dataMap["whereCause"] = whereCause;
  //获取距离较近的小区清单
  wx.request({
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    url: 'https://www.meafe.cn/wx/ajax/' + URL,
    data: dataMap,
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    success: function (res) {
      var obj = res.data;
      callback(obj);
    },
    fail: function () { },
    complete: function () { }
  })
}

function FileDelete(file_loc) {
  wx.request({
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    url: 'https://www.meafe.cn/wx/RemoveFile',
    data: { file_loc: file_loc, randnum: Math.random() + '' },
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    success: function (res) { },
    fail: function () { },
    complete: function () { }
  })
}

function FileChooseAndUpload(upload_folder, selectedCallback, uploadedcallback) {
  wx.chooseImage({
    success: function (res) {
      var tempFilePaths = res.tempFilePaths
      selectedCallback(tempFilePaths[0]);
      FileUpload(upload_folder, tempFilePaths[0], uploadedcallback);
    }
  })
}

function FileUpload(upload_folder, file_loc, callback) {
  wx.uploadFile({
    url: 'https://www.meafe.cn/wx/UploadFileNew', //仅为示例，非真实的接口地址
    filePath: file_loc,
    name: 'file',
    formData: { 'upload_folder': upload_folder },
    success: function (res) {
      //do something
      console.log(res.data);
      var obj = JSON.parse(res.data);
      callback(obj);
    }
  })
}

function Toast(msg) {
  wx.showToast({
    title: msg,
    icon: 'success',
    duration: 1500
  })
}

function ArrayIndex1(findStr, array) {
  for (var i = 0; i < array.length; i++) {
    //console.log(findStr+","+array[i]);
    if (array[i] == findStr) {
      return i;
    }
  }
  return -1;
}

function ArrayIndex(findStr, array, columnIndex) {
  for (var i = 0; i < array.length; i++) {
    //console.log(findStr + "," + array[i][columnIndex]);
    if (array[i][columnIndex] == findStr) {
      return i;
    }
  }
  return -1;
}
module.exports = {
  SQLQuery: SQLQuery,
  FileUpload: FileUpload,
  FileDelete: FileDelete,
  FileChooseAndUpload: FileChooseAndUpload,
  SQLUpdate: SQLUpdate,
  Toast: Toast,
  SQLEdit: SQLEdit,
  ArrayIndex: ArrayIndex,
  ArrayIndex1: ArrayIndex1
}
