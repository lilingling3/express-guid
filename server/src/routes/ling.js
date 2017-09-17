// 路由
var express = require('express');
var router = express.Router();
var g = require('../core/gateway');

var loginCtrl = require('../controller/ling/loginCtrl');
var bookCtrl = require('../controller/ling/bookCtrl');

router.get('/login',g.use(loginCtrl.getPage));
router.post('/login', g.use(loginCtrl.postPage));

router.get('/book',g.use(bookCtrl.getPage));
router.get('/book/delItem',g.use(bookCtrl.delItem));
router.get('/book/updateItem',g.use(bookCtrl.updateItem));
router.post('/book/updateItem',g.use(bookCtrl.updateSaveItem));
router.post('/book/addItem',g.use(bookCtrl.addItem));
router.post('/book/restory',g.use(bookCtrl.restoryData));

module.exports = router;