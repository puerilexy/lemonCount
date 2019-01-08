var mongo = require('mymongo1610');
var mongodb = require('mymongo1610/utils/getCollection');
// 添加账单
function addBill(req, res) {
    var params = req.body
    uid = params.uid,
        timer = params.timer,
        icon = params.icon,
        intro = params.intro,
        type = params.type,
        money = params.money,
        cid = params.cid;

    if (!uid || !timer || !icon || !intro || !type || !money || !cid) {
        return res.json({ code: 4, msg: '缺少参数' })
    }

    mongo.find('userlist', { _id: uid }, function (err, result) {
        if (err) {
            return res.json({ code: 0, msg: err });
        }
        if (result.length > 0) {
            isHasClassify();
        } else {
            res.json({ code: 3, mag: '没有此用户' })
        }
    })
    function isHasClassify() {
        mongo.find('typelist', { $and: [{ uid: { $in: ['*', cid] } }, { type: type }, { intro: intro }] }, function (err, result) {
            if (err) {
                return res.json({ code: 0, msg: err });
            }
            if (result.length > 0) {
                addBillFun();
            } else {
                res.json({ code: 3, mag: '没有此分类，请先创建分类' })
            }
        })
    }
    function addBillFun() {
        mongo.insert('bill', { uid: uid, timer: new Date(timer), icon: icon, intro: intro, type: type, money: money }, function (err) {
            if (err) {
                return res.json({ code: 0, msg: err });
            }
            res.json({ code: 1, msg: '添加成功' })
        })
    }
}

//查询账单
function getBill(req, res) {
    var params = req.query,
        uid = params.uid,
        timer = params.timer,
        intro = params.intro;
    if (!uid || !timer) {
        res.json({ code: 4, msg: '缺少参数' })
    }
    var bigTimer = null;
    if (timer.indexOf('-') != -1) {
        // 按月查询 2018-12 ~ 2019 ~ 01(不包含1月)  $lt: 小于 $gte 大于等于
        var arr = timer.split('-');
        if (arr[1] === '12') {
            bigTimer = (arr[0] * 1 + 1) + '-01';
        } else {
            bigTimer = arr[0] + '-' + (arr[1] * 1 + 1);
        }
    } else {
        //按年查询  2018 ~ 2019
        bigTimer = timer * 1 + 1 + '';
    }
    mongodb('bill', function (err, con, collection) {
        if (err) {
            return res.json({ code: 0, msg: err })
        };
        // sort( {排序条件} ) 1为升序，-1为降序
        collection.find({ $and: [{ timer: { $gte: new Date(timer), $lt: new Date(bigTimer) } }, { uid: uid },{intro:{$in:[intro]}}] }).sort({timer: -1}).toArray(function (error, results) {
            if (error) {
                return res.json({ code: 0, msg: error });
            }
            if (results.length > 0) {
                res.json({ code: 1, data: results });
            } else {
                res.json({ code: 2, msg: '暂无数据' });
            }
            con.close();
        })
    })
}

//删除账单
function delBill(req,res){
    var id = req.query.id;
    mongo.delete('bill',{_id:id},function(err){
        if(err){
            return res.json({code: 0,msg:err});
        }
        res.json({code:1,msg:'删除成功'})
    })
}

module.exports = {
    addBill: addBill,
    getBill: getBill,
    delBill: delBill
}