class DB {
  constructor(db_name = 'db_name', table = 'table', field = ['id unique', 'data'], pk = 'id', v = '1.0', size = (1024 * 1024 * 1024 * 1024), display_name = 'show databases') {
    DB.db_name = db_name;
    DB.table = table;
    DB.pk = pk;
    DB.v = v;
    DB.display_name = display_name;
    DB.size = size;
    DB.field = field;
    DB.connection = openDatabase(DB.db_name, DB.v, DB.display_name, DB.size);
    if (!DB.connection) {
      DB.error_msg = '连接失败';
      DB.error_code = -1;
    }
    DB.create_table();
    this.condition = false;
  }

  static create_table() {
    let field_str = DB.explode(DB.field);
    let sql = "CREATE TABLE IF NOT EXISTS " + DB.table + " (" + field_str + ")";
    let data = [];
    DB.connection.transaction(function (tx) {
      tx.executeSql(sql, data, function (tx, res) {
        console.log('创建成功');
      }, function (tx, error) {
        DB.error_code = error.code;
        DB.error_msg = error.message;
      });
    })
  };

  static query(sql, success_callback = function (tx, res) {
  }, error_callback = function (tx, error) {
  }, data = []) {
    if (sql) {
      DB.connection.transaction(function (tx) {
        tx.executeSql(sql, data, success_callback, error_callback);
      });
    } else {
      return false;
    }
  };

  insert(data = {}, success = function (tx, res) {
  }, error = function (tx, error) {
  }) {
    if (typeof data != "object") {
      return false;
    }
    let sql_condition = DB.json_to_string(data);
    let sql = "INSERT INTO " + DB.table + " (" + sql_condition.field + ") VALUES (" + sql_condition.values + ")";
    DB.query(sql, success, error);
  };

  delete(id = 0, success = function (tx, res) {
  }, error = function (tx, error) {
  }) {
    let sql = '';
    if (id) {
      sql = "DELETE FROM " + DB.table + " WHERE " + DB.pk + " = '" + id + "'";
    }
    if (this.condition) {
      sql = "DELETE FROM " + DB.table + " WHERE " + this.condition;
      this.condition = false;
    }
    DB.query(sql, success, error)
  };

  update(data = {}, id = 0, success = function (tx, res) {
  }, error = function (tx, error) {
  }) {
    let sql = '';
    let update_data = '';
    if (!data) {
      return false;
    }
    if (typeof data == "string") {
      update_data = data;
    }
    if (typeof data == "object") {
      update_data = DB.format(data)
    }
    if (id) {
      sql = "UPDATE " + DB.table + " SET " + update_data + " WHERE " + DB.pk + " = '" + id + "'";
    } else if (this.condition) {
      sql = "UPDATE " + DB.table + " SET " + update_data + " WHERE " + this.condition;
      this.condition = false;
    } else {
      sql = "UPDATE " + DB.table + " SET " + update_data;
    }
    DB.query(sql, success, error)
  }

  select(success = function (tx, res) {
  }, error = function (tx, error) {
  }, id = 0) {
    let sql = '';
    if (id) {
      sql = "SELECT * FROM " + DB.table + " WHERE " + DB.pk + " = '" + id + "'";
    } else if (this.condition) {
      sql = "SELECT * FROM " + DB.table + " WHERE " + this.condition;
      this.condition = false;
    } else {
      sql = "SELECT * FROM " + DB.table;
    }
    DB.query(sql, success, error)
  }

  where(factor) {
    if (!factor) {
      this.condition = false;
    }
    if (typeof factor == "string") {
      this.condition = factor;
    }
    if (typeof factor == "object") {
      this.condition = DB.format(factor)
    }
    return this;
  }

  static format(factor, tag = "=", and = "AND") {
    let lengths = DB.obj_length(factor);
    if (lengths === 1) {
      let return_str = '';
      Object.keys(factor).forEach(function (key) {
        return_str = key + tag + " '" + factor[key] + "'";
      });
      return return_str;
    } else {
      let return_str = '';
      let i = 0;
      Object.keys(factor).forEach(function (key) {
        if (lengths === i) {
          return_str += key + tag + " '" + factor[key];
        } else {
          return_str += key + tag + " '" + factor[key] + "' " + and;
        }
      });
      return return_str;
    }
  }

  drop(success = function (tx, res) {
  }, error = function (tx, error) {
  }, table = '') {
    let exec_table = table ? table : DB.table;
    let sql = "DROP TABLE IF EXISTS " + exec_table;
    DB.query(sql, success, error);
  }

  static json_to_string(data) {
    let field = '';
    let values = '';
    Object.keys(data).forEach(function (key) {
      field += key + ',';
      values += "'" + data[key] + "'" + ',';
    });
    field = field.substring(0, field.length - 1);
    values = values.substring(0, values.length - 1);
    if (!field || !values) {
      return false;
    }
    return {field, values};
  }

  static implode(tag = ',', array) {
    let return_array = [];
    for (let k in array) {
      if (array[k].checked) {
        if (array[k].value !== 0) {
          return_array.push(array[k].value);
        }
      }
    }
    let return_str = return_array ? return_array.join(tag) : 0;
    return return_str;
  }

  static explode(array, tag = ',') {
    return array.join(tag);
  }

  static obj_length(obj) {
    let count = 0;
    for (let i in obj) {
      count++;
    }
    return count;
  };
}

// let db = new DB('test', 'test_table', ['id unique', 'name', 'sex', 'age']);
// db.drop(function (tx,res) {
//   console.log(res);
// });
// for (let i = 1; i < 11; i++) {
//   db.insert({"id": i, "name": "haha" + i, "sex": 1, "age": i * 10}, function (tx,res) {
//     console.log(res);
//   });
// }
//
// db.update({"name": "wahahaha1"}, 1, function (tx,res) {
//   console.log(res);
// });
// db.where({"id": 7}).update({"name": "wahahaha"});
// db.where({id: 1}).delete(0, function (tx,res) {
//   console.log(res);
// });
//
// db.delete(2, function (tx,res) {
//   console.log(res);
// });
// db.select(function (tx,res) {
//   console.log(res);
// });
