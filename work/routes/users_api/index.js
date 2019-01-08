var mongo = require('mymongo1610');

// 创建新用户
function addUser(req, res) {
    var nick_name = req.body.nick_name || '';
    mongo.insert('userlist', { nick_name: nick_name }, function (err) {
        if (err) {
            return res.json({ code: 0, msg: err })
        };
        res.json({ code: 1, msg: '创建成功' })
    })
}

module.exports = {
    addUser: addUser
}