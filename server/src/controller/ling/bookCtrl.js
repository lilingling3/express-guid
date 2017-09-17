var g = require('../../core/gateway');
var cf = require('../../core/common-func');

const MongoClient = require('mongodb').MongoClient;
var  ObjectId = require('mongodb').ObjectID;
const URL = 'mongodb://localhost:27017/test';


exports.getPage = function *(req, body, query){
  return g.view('book',{username:''});
};

// exports.postPage = function *(req, body, query) {
//   var username = body.username;
//   var list = [
//     // {bookName:'未来世界222',author:'zzk'},
//     // {bookName:'大彪洋222',author:'yujie'},
//     // {bookName:'黑客的幻想222',author:'adam'}
//   ];
//   // 使用yield 解决异步获取不到数据 使用yield+ thunk()函数  yield + promise
//   // var list = yield selectDataThunk();
  
//   var list = yield selectDataPromise();
//   return g.view('book',{username:username,list});
// };
// 编辑
exports.updateItem = function *(req, body, query) {
  // var username = req.cookies.username;
  var id = ObjectId(query.id);
  var temp = yield updateDataPromise(id);
  return g.view('book-edit',{temp});
};
// 编辑保存数据库
exports.updateSaveItem = function *(req, body, query) {
  var username = req.cookies[0];
  // console.log(username)
  var id = ObjectId(body.id);
  var bookName = body.bookName;
  var author = body.author;
  var list = yield updateSaveItem(id,bookName,author);
  
  return g.view('book',{username:username,list});
};
// 删除
exports.delItem = function *(req, body, query) {
  var id = ObjectId(query.id);
  var username = req.cookies[0];
  // delDataPromise();
  var list = yield delDataPromise(id);
  return g.view('book',{username:username ,list});
};
// 增加数据
exports.addItem = function *(req, body, query) {
  var username = req.cookies[0];
  var bookName = body.bookName;
  var status = body.status;
  var author = body.author;
  // delDataPromise();
  var list = yield addDataPromise(bookName,author,status);
  return g.view('book',{username:username,list});
};
// 数据恢复
exports.restoryData = function *(req, body, query) {
  var username = req.cookies[0];
  var list = yield restoryDataPromise();
  return g.view('book',{username:username,list});
};

// 查询数据  thunk 函数写法
function selectDataThunk(){
  return cb => {
    MongoClient.connect(URL,(err, db)=>{
      if(err)return cb(err);
      var col = db.collection('example');
      col.find().toArray((err,result)=>{
        if(err) return err;
        cb(null, result);
      })
    })
  }
}

// 查询数据库 promise
function selectDataPromise(){
  return new Promise(function(resolve, reject){
    MongoClient.connect(URL,(err, db)=>{
      if(err) return reject(err)
      var col = db.collection('example');
      col.find().toArray((err,result)=>{
        if(err) return err;
        resolve(result)
      })
    })
  })
}

function updateDataPromise (id){
  return new Promise(function(resolve, reject){
    MongoClient.connect(URL,(err, db)=>{
      var col = db.collection('example');
      col.findOne({_id:id},function(err,result){
        if(err) reject(err)
        resolve(result)
      })
    })
  })
}
function updateSaveItem (id,bookName,author){
  return new Promise(function(resolve, reject){
    MongoClient.connect(URL,(err, db)=>{
      var col = db.collection('example');
      col.update({_id:id},{$set:{bookName:bookName,author:author}},function(){
        col.find().toArray((err,result)=>{
          if(err) return err;
          resolve(result)
        })
      })
    })
  })
}


function delDataPromise(id){
  return new Promise(function(resolve, reject){
    MongoClient.connect(URL,(err, db)=>{
      var col = db.collection('example');
      // 直接删除数据库

      // col.deleteOne({_id:id},function(err,res){
      //   if(err) reject(err)
      //     col.find().toArray((err,result)=>{
      //       if(err) return err;
      //       resolve(result)
      //     })
      // })

      // 更改状态值
      col.update({_id:id},{$set:{status:0}},function(){
        col.find().toArray((err,result)=>{
          if(err) return err;
          resolve(result)
        })
    })
  })
  })
}
function addDataPromise(bookName,author,status){
  return new Promise(function(resolve, reject){
    MongoClient.connect(URL,(err, db)=>{
      var col = db.collection('example');
      var list = {bookName:bookName,author:author,status:status};
      col.insertOne(list,function(){
        col.find().toArray((err,result)=>{
          if(err) return err;
          resolve(result)
        })
    })
    })
  })
}
function restoryDataPromise(bookName,author,status){
  return new Promise(function(resolve, reject){
    MongoClient.connect(URL,(err, db)=>{
      var col = db.collection('example');
      col.updateMany({status:0},{$set:{status:1}},function(){
        col.find().toArray((err,result)=>{
          if(err) return err;
          resolve(result)
        })
      })
    })
  })
}





