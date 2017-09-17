/**
 * Created by zhongzhengkai on 2017/6/29.
 */

var xlsx = require('xlsx');
var co=require('co');
var thunkify=require('thunkify');
var MongoClient=require('mongodb').MongoClient;
var url='mongodb://localhost:27017/lottery';

function insertDocs(docs){
  return cb=>{
    MongoClient.connect(url,(err, db)=>{
      if(err)return cb(err);
      var lotteryColl = db.collection('daily_data');
      lotteryColl.insertMany(docs,()=>{
        db.close();
        if(err)cb(err);
        else cb(null);
      });
    })
  }
}

var columnLetters = [ 'A','B','C','D', 'E', 'F','G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R' ];
var letter_next_ = { 'A':'B','B':'C','C':'D','D':'E', 'E':'F', 'F':'G','G':'H', 'H':'I', 'I':'J', 'J':'K', 'K':'L',
  'L':'M', 'M':'N', 'N':'O', 'O':'P', 'P':'Q', 'Q':'R', 'R':null };
var letter_prop = {
  A: 'BP_Number',
  B: 'Sales_Dealer_Name_CN',
  C: 'Sales_Dealer_Name_EN',
  D: 'Customer_Name',
  E: 'Title',
  F: 'phoneNumber',
  G: 'Street',
  H: 'Address',
  I: 'Last_Name',
  J: 'First_Name',
  K: 'Date_of_Birth',
  L: 'vin',
  M: 'Vehicle_Status',
  N: 'Model_Range_Name',
  O: 'Model_Year',
  P: 'Model_Type',
  Q: 'Model_Description',
  R: 'Customer_Delivery_Date'
};
function checkNext(sheet, data, lineNO, columnNO) {
  var nextColumnNO = letter_next_[columnNO];
  if(nextColumnNO){
    var nextKey = nextColumnNO + lineNO;
    if (sheet[nextKey] === undefined){
      data[letter_prop[nextColumnNO]] = '';
      checkNext(sheet, data, lineNO, nextColumnNO)
    }
  }
}

function *main(){
  var startTime = Date.now();
  var DATA_NO = process.env.DATA_NO;
  var workbook = xlsx.readFile('./data'+DATA_NO+'.xlsx');
  var sheetName = workbook.SheetNames[0];
  var sheet = workbook.Sheets[sheetName];

  var keys = Object.keys(sheet);
  var len = keys.length;
  var dataList = [];
  var vinMap = {};
  var missCount = 0;
  var dupCount = 0;

  var data = {_createTime:Date.now()}, readingLineNO = '2';
  for (var i = 0; i < len; i++) {
    var key = keys[i];
    if (!key.startsWith('!')) {
      var lineNO = key.substr(1);
      if (lineNO != '1') {
        var columnNO = key.substr(0,1);
        if(lineNO == readingLineNO){
          data[letter_prop[columnNO]] = sheet[key].v;
          checkNext(sheet, data, lineNO, columnNO);
        }else{
          readingLineNO = lineNO;
          var vin = data.vin;
          if(vin!=''){
            if(!vinMap[vin]){
              vinMap[vin] = 1;
              dataList.push(data);
            }else dupCount++;
          }else missCount++;
          data = {_createTime:Date.now()};
        }
      }
    }
  }
  var vin = data.vin;
  if(vin!=''){
    if(!vinMap[vin]){
      vinMap[vin] = 1;
      dataList.push(data);
    }else dupCount++;
  }else missCount++;


  console.log('============>>>>>> total:',dataList.length);
  console.log('============>>>>>> miss vin count:',missCount);
  console.log('============>>>>>> dup vin count:',dupCount);

  while(dataList.length>0){
    var piece = dataList.splice(0,2000);
    yield insertDocs(piece);
    console.log('============>>>>>> inserted count:',piece.length);
  }

  console.log('done! elapseTime: '+(Date.now()-startTime+'ms'));
}

