//node-mongodb-native test
const MongoClient = require('mongodb').MongoClient;
// connect url
const URL = 'mongodb://localhost:27017/test';


// 插入数据
var insertData = function(db,callback){
    // 连接表
    var col = db.collection('example');
    // 插入数据
    //  var data = [{"name":'wilson001',"age":21},{"name":'wilson002',"age":22}];
    // status 0 表示正常数据 1表示删除数据
    var list = [
        {bookName:'未来世界222',author:'zzk',status:0},
        {bookName:'大彪洋222',author:'yujie',status:1},
        {bookName:'黑客的幻想222',author:'adam',status:0}
      ];
    col.insertMany(list,function(err,result){
        if(err){
            console.log(err);
            return;
        }
        callback(result)
    })
}
// Connect using MongoClient insertData
     MongoClient.connect(URL, function(err, db) {
        console.log('连接成功 添加数据库');
        insertData(db,function(result){
            console.log(result);
            db.close();
        })
    });


// 查询数据
// var selectData = function(db,callback){
//     // 连接表
//     var col = db.collection('example');
//     // 查询数据库
//     var whereStr = {"name":'wilson001'};
//     // find() 查询数据库 返回游标 需要toArray 转成真正的数据
//     col.find(whereStr).toArray(function(err,result){
//         if(err){
//             console.log(err);
//             return;
//         }
//         callback(result)
//     })
// }


// MongoClient.connect(URL, function(err, db) {
//     console.log('连接成功 查询数据库');
//     selectData(db,function(result){
//         console.log(result);
//         db.close();
//     })
// });

// 修改数据
// var updateData = function(db,callback){
//      // 连接表
//     var col = db.collection('example');
//     // 修改数据库
//     var whereStr = {"name":'wilson001'};
//     var updateStr = {$set:{age:100}} ;
//     col.update(whereStr,updateStr,function(err,result){
//         if(err){
//             console.log(err);
//             return;
//         }

//         callback(result)
//     })
// }

// MongoClient.connect(URL, function(err, db) {
//     console.log('连接成功 修改数据库');
//     updateData(db,function(result){
//         console.log(result);
//         db.close();
//     })
// });


// 删除数据
// var delData = function(db, callback) {  
//      // 连接表
//      var col = db.collection('test');
//     //删除数据
//     var whereStr = {"name":'wilson002'};
//     col.deleteOne(whereStr, function(err, result) {
//       if(err)
//       {
//         console.log('Error:'+ err);
//         return;
//       }     
//       callback(result);
//     });
//   }
  
//   MongoClient.connect(URL, function(err, db) {
//     console.log("连接成功！删除数据");
//     delData(db, function(result) {
//     //   console.log(result);
//       db.close();
//     });
//   });


// 获取数据的数量
MongoClient.connect(URL, function(err, db) {
    // console.log("连接成功！查找个数");
    // var col = db.collection('test');
    // col.count() 返回的promise对象
    // col.count().then(function(count){
    //     console.log(count) //2
    // })

    // col.count({name: 'wilson002'}).then(function(count){
    //     console.log(count) // 1
    // }) 
})


// module.exports = {selectData,insertData,delData,updateData}
  // 解决id 查找不到的问题

//  var  ObjectId = require('mongodb').ObjectID;
// console.log(ObjectId)
// MongoClient.connect(URL,(err, db)=>{
//     if(err) return err;
//     var col = db.collection('example');
//     var id = ObjectId("59afd45f646b507a0176c836");
//     col.find({_id: id},function(err,res){
//       // console.log(res)
//       console.log('查看到了'+res)
//       if(err) return err;
      
//     })
//   })




//   MongoClient.connect(URL, function(err, db) {
//     console.log("连接成功！查找个数");
//     var col = db.collection('example');
//     // col.count() 返回的promise对象
//     col.count().then(function(count){
//         console.log(count) //2
//     })
//     var id = ObjectId("59afd45f646b507a0176c836");
//     col.count({_id:id}).then(function(count){
//         console.log(count) // 1
//     }) 
// })

// var delData = function(db, callback) {  
//      // 连接表
//      var col = db.collection('example');
//     //删除数据
//     var id = ObjectId("59afd45f646b507a0176c836");
//     col.deleteOne({_id:id}, function(err, result) {
//       if(err)
//       {
//         console.log('Error:'+ err);
//         return;
//       }     
//       callback(result);
//     });
//   }
  
//   MongoClient.connect(URL, function(err, db) {
//     console.log("连接成功！删除数据");
//     delData(db, function(result) {
//     //   console.log(result);
//       db.close();
//     });
//   });