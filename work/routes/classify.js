var express = require('express');
var router = express.Router();

var classifyApi = require('./classify_api/index.js');

// 获取分类图标列表接口
router.get('/api/iconlist', classifyApi.getIcons);

// 查询分类
router.get('/api/getClassify',classifyApi.getClassify);

// 添加分类
router.post('/api/addClassify',classifyApi.addClassify)

module.exports = router;