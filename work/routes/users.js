var express = require('express');
var router = express.Router();

var usersApi = require('./users_api/index.js');

//创建用户
router.post('/api/addUser', usersApi.addUser);

module.exports = router;