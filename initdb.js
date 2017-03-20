var fs = require("fs");
var sqlite3 = require("sqlite3");

fs.readFile("./sql/tables.sql", "utf8", function (err, fileData) {
  if (err) { throw new Error(err); }

  var sqlCreateTables = fileData;
  var db = new sqlite3.Database("db.sqlite");

  db.serialize(function() {
    db.run(sqlCreateTables);
  });

  db.close();
});
