function ListData(map, success, failed, complete) {
  console.log("开始网络请求..");
  //获取距离较近的小区清单
  wx.request({
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    url: 'https://www.meafe.cn/paidan/ListData',
    data: {t:JSON.stringify(map)},
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    success: function (res) {
      console.log("http success");
      if(res.statusCode==200){
        var obj = res.data;
        if (success)
          success(obj);
      }
      else {
        if (failed)
          failed(obj);
      }
    },
    fail: function (res) {
      console.log("http fail");
      if (failed)
        failed(res);
    },
    complete: function () {
      if (complete)
        complete();
    }
  })
}


function Update(map, success, failed, complete) {
  console.log("开始网络请求..");
  //获取距离较近的小区清单
  wx.request({
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    url: 'https://www.meafe.cn/paidan/Update',
    data: { t: JSON.stringify(map) },
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    success: function (res) {
      console.log("http success");
      var obj = res.data;
      if (success)
        success(obj);
    },
    fail: function (res) {
      console.log("http fail");
      if (failed)
        failed(res);
    },
    complete: function () {
      if (complete)
        complete();
    }
  })
}


function UpdateById(map, success, failed, complete) {
  console.log("开始网络请求..");
  //获取距离较近的小区清单
  wx.request({
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    url: 'https://www.meafe.cn/paidan/UpdateById',
    data: { t: JSON.stringify(map) },
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    success: function (res) {
      console.log("http success");
      var obj = res.data;
      if (success)
        success(obj);
    },
    fail: function (res) {
      console.log("http fail");
      if (failed)
        failed(res);
    },
    complete: function () {
      if (complete)
        complete();
    }
  })
}

function SCB3Query(sql, callback1, callback2) {
  console.log("开始网络请求..");
  //获取距离较近的小区清单
  wx.request({
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    url: 'https://www.meafe.cn/wx/ajax/sql_get_tcscb3.jsp',
    data: {
      sql: sql,
      randnum: Math.random() + ''
    },
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    success: function(res) {
      console.log("http success");
      var obj = res.data;
      if (callback1)
        callback1(obj);
    },
    fail: function(res) {
      console.log("http fail");
      if (callback2)
        callback2(res);
    },
    complete: function() {

    }
  })
}

function SQLEdit(sql, callback1, callback2) {
  //获取距离较近的小区清单
  wx.request({
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    url: 'https://www.meafe.cn/wx/ajax/sql_edit.jsp',
    data: {
      sql: sql,
      randnum: Math.random() + ''
    },
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    success: function(res) {
      console.log("http success");
      var obj = res.data;
      if (callback1)
        callback1(obj);
    },
    fail: function(res) {
      console.log("http fail");
      if (callback2)
        callback2(res);
    },
    complete: function() {}
  })
}

function SCB3Edit(sql, callback1, callback2) {
  //获取距离较近的小区清单
  wx.request({
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    url: 'https://www.meafe.cn/wx/ajax/sql_edit_tcscb3.jsp',
    data: {
      sql: sql,
      randnum: Math.random() + ''
    },
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    success: function(res) {
      console.log("http success");
      var obj = res.data;
      if (callback1)
        callback1(obj);
    },
    fail: function(res) {
      console.log("http fail");
      if (callback2)
        callback2(res);
    },
    complete: function() {}
  })
}

function SQLUpdate(URL, dataMap, tableName, whereCause, callback, fail_cb) {
  dataMap["tableName"] = tableName;
  dataMap["randnum"] = Math.random() + '';
  if (whereCause != null)
    dataMap["whereCause"] = whereCause;
  //获取距离较近的小区清单
  wx.request({
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    url: 'https://www.meafe.cn/wx/ajax/' + URL,
    data: dataMap,
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    success: function(res) {
      var obj = res.data;
      callback(obj);
    },
    fail: function() {
      if (fail_cb) {
        fail_cb();
      }
    },
    complete: function() {}
  })
}

function FileDelete(file_loc) {
  wx.request({
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    url: 'https://www.meafe.cn/wx/RemoveFile',
    data: {
      file_loc: file_loc,
      randnum: Math.random() + ''
    },
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    success: function(res) {},
    fail: function() {},
    complete: function() {}
  })
}

function FileChooseAndUpload(upload_folder, selectedCallback, uploadedcallback) {
  wx.chooseImage({
    count: 1,
    success: function(res) {
      var tempFilePaths = res.tempFilePaths
      selectedCallback(tempFilePaths[0]);
      FileUpload(upload_folder, tempFilePaths[0], uploadedcallback);
    }
  })
}

function FileUpload(upload_folder, file_loc, callback, fail_cb) {
  wx.uploadFile({
    url: 'https://www.meafe.cn/wx/UploadFileNew', //仅为示例，非真实的接口地址
    filePath: file_loc,
    name: 'file',
    formData: {
      'upload_folder': upload_folder
    },
    success: function(res) {
      //do something
      console.log('上传结果:' + res.data);
      var obj = JSON.parse(res.data);
      callback(obj);
    },
    fail: function(res) {
      if (fail_cb) {
        fail_cb(res);
      }
    }
  })
}

function nwMsg(p1, p2, cb, cbf, cbc) {
  wx.request({
    url: 'https://www.meafe.cn/sxf/oa_news/',
    data: {
      top: p1,
      fl: p2
    },
    method: 'POST',
    success: function (res) {
      //console.log(res);
      if (cb)
        cb(res);
    },
    fail: function (res) {
      if (cbf)
        cbf(res);
    },
    complete: function (res) {
      if (cbc)
        cbc(res);
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
  FileUpload: FileUpload,
  FileDelete: FileDelete,
  FileChooseAndUpload: FileChooseAndUpload,
  SQLUpdate: SQLUpdate,
  Toast: Toast,
  SQLEdit: SQLEdit,
  SCB3Query: SCB3Query,
  SCB3Edit: SCB3Edit,
  ArrayIndex: ArrayIndex,
  ArrayIndex1: ArrayIndex1,
  nwMsg: nwMsg,
  ListData:ListData
}

