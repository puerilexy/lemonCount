var mongo = require('mymongo1610');

// 获取分类图标列表接口
function getIcons(req, res) {
    mongo.find('iconlist', function (err, results) {
        if (err) {
            return res.json({ code: 0, msg: err })
        };
        res.json({ code: 1, data: results })
    })
}

//查询分类
function getClassify(req, res) {
    var uid = req.query.uid;
    if (!uid) {
        return res.json({ code: 4, msg: '缺少参数' })
    }
    mongo.find('typelist', { uid: { $in: ['*', uid] } }, function (err, results) {
        if (err) {
            return res.json({ code: 0, msg: err })
        };
        res.json({ code: 1, data: results })
    })
}

// 添加分类
function addClassify(req, res) {
    var params = req.body,
        intro = params.intro,
        icon = params.icon,
        uid = params.uid,
        type = params.type;
    if (!intro || !icon || !uid || !type) {
        return res.json({ code: 4, msg: '缺少参数' })
    }
    //先查询用户是否存在
    mongo.find('userlist', { _id: uid }, function (err, result) {
        if (err) {
            return res.json({ code: 0, msg: err })
        };
        if (result.length > 0) {
            //再查询分类名是否存在
            isHasClassify();
        } else {
            res.json({ code: 2, msg: '此用户不存在' })
        }
    });
    function isHasClassify() {
        mongo.find('typelist', { $and: [{ uid: { $in: ['*', uid] } }, { type: type }, { intro: intro }] }, function (err, result) {
            if (err) {
                return res.json({ code: 0, msg: err })
            };
            if (result.length > 0) {
                res.json({ code: 3, msg: '此分类已经存在' })
            } else {
                addClassifyFun();
            }
        })
    };
    function addClassifyFun() {
        mongo.insert('typelist', params, function (err) {
            if (err) {
                return res.json({ code: 0, msg: err })
            };
            res.json({ code: 1, msg: '添加成功' })
        })
    }
}

module.exports = {
    getIcons: getIcons,
    getClassify: getClassify,
    addClassify: addClassify
}