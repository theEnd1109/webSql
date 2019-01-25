# webSql
chrome webSql class
谷歌浏览器 web sql 类库
# 方法
```
// 实例化数据库
let db = new DB('test', 'test_table', ['id unique', 'name', 'sex', 'age']);
// 删除表
db.drop(function (tx,res) {
  console.log(res);
},function (tx,error) {
  console.log(error)
}, table = '');; // table 表名 不传参 默认为实例化db的表名
// 添加
db.insert({"id": i, "name": "haha" + i, "sex": 1, "age": i * 10}, function (tx,res) {
  console.log(res);
}, function (tx, error) {
  console.log(error.message);
});
// 更新 根据主键ID
db.update({"name": "wahahaha1"}, 1, function (tx,res) {
  console.log(res);
}, function (tx, error) {
  console.log(error.message);
});
// 更新 根据where条件
db.where({"id": 7}).update({"name": "wahahaha"});
// 删除 根据where条件
db.where({id: 1}).delete(0, function (tx,res) {
  console.log(res);
}, function (tx, error) {
  console.log(error.message);
});
// 还是那出 根据主键ID
db.delete(2, function (tx,res) {
  console.log(res);
}, function (tx, error) {
  console.log(error.message);
});
// 查询所有
db.select(function (tx,res) {
  console.log(res);
}, function (tx, error) {
  console.log(error.message);
});
// 查询 根据where条件
db.where({"id":1}).select(function (tx,res) {
  console.log(res);
}, function (tx, error) {
  console.log(error.message);
});
```
# 希望有大神可以帮忙修改一下, 谢谢
