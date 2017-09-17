//node-mongodb-native test
const MongoClient = require('mongodb').MongoClient;
// connect url
const URL = 'mongodb://localhost:27017/test';
var operateMethod = require('./test1');
var insertData = function(URL){
    // Connect using MongoClient insertData
    MongoClient.connect(URL, function(err, db) {
        console.log('连接成功 添加数据库');
        operateMethod.insertData(db,function(result){
            console.log(result);
            db.close();
        })
    });
}
var selectData = function(URL){
    // Connect using MongoClient insertData
    MongoClient.connect(URL, function(err, db) {
        console.log('连接成功 添加数据库');
        operateMethod.selectData(db,function(result){
            console.log(result);
            return result
            db.close();
        })
    });
}
var updateData = function(URL){
    // Connect using MongoClient insertData
    MongoClient.connect(URL, function(err, db) {
        console.log('连接成功 添加数据库');
        operateMethod.updateData(db,function(result){
            console.log(result);
            db.close();
        })
    });
}
var delData = function(URL){
    // Connect using MongoClient insertData
    MongoClient.connect(URL, function(err, db) {
        console.log('连接成功 添加数据库');
        operateMethod.delData(db,function(result){
            console.log(result);
            db.close();
        })
    });
}

module.exports = {selectData,insertData,delData,updateData}