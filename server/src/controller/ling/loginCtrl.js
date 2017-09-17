var g = require('../../core/gateway');
var cf = require('../../core/common-func');

const MongoClient = require('mongodb').MongoClient;
const URL = 'mongodb://localhost:27017/test';


exports.getPage = function *(req, body, query){
  return g.view('login',{},{layout:false});
};

exports.postPage = function *(req, body, query) {
  var username = body.username;
  var list = [
    // {bookName:'未来世界222',author:'zzk'},
    // {bookName:'大彪洋222',author:'yujie'},
    // {bookName:'黑客的幻想222',author:'adam'}
  ];
  // 使用yield 解决异步获取不到数据 使用yield+ thunk()函数  yield + promise
  // var list = yield selectDataThunk();

  // 登录成功后 设置cookie
    req.cookies = {
      username:username,
      expires: new Date(Date.now() + 1000*60*60) // 设置过期时间
   }
  
  console.log("登录后设置 cookie"+req.cookies.username)
  // req.cookies.username = username;
  // req.cookies.expires = new Date(Date.now() + 1000*60*60); // 设置过期时间
  var list = yield selectDataPromise();
  return g.view('book',{username:username,list},{cookies:[{"value":req.cookies.username}]});
};

// 查询数据  thunk 函数写法
function selectDataThunk(){
  return cb => {
    MongoClient.connect(URL,(err, db)=>{
      if(err)return cb(err);
      var col = db.collection('example');
      col.find().toArray((err,result)=>{
        if(err) return err;
        cb(null, result);  // 第一个表示错误数据
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





