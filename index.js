var express = require("express");
var sqlite3 = require("sqlite3");
var fs = require("fs");

var app = express();
var port = 3000;

var promisesBeforeServerStart = [];

function readFileAsPromise(filePath) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filePath, "utf8", function (err, fileData) {
      if (err) { reject(err); }
      else { resolve(fileData); }
    });
  });
};

var sqlFiles = ["getUsers", "insertUser"];
var sql = {};
var sqlReadPromises = sqlFiles
  .map(s => "./sql/" + s + ".sql")
  .map(readFileAsPromise)
  .map((p, i) => p.then(fileData => sql[sqlFiles[i]] = fileData));

promisesBeforeServerStart = promisesBeforeServerStart.concat(sqlReadPromises);

var db = new sqlite3.Database("db.sqlite");

// basic test, visit /test to insert dummy user and / to dump all the users
app.get("/", function (req, res) {
  db.serialize(function() {
    var rows = [];
    db.all(sql.getUsers, function(err, rows) {
      res.send(rows.map(r => r.full_name).join(" - "));
    });
  });
});

app.get("/test", function (req, res) {
  db.serialize(function() {
    var statement = db.prepare(sql.insertUser);
    statement.run("User McTest");
    statement.finalize();
  });
  res.send("Test insert.");
});

Promise.all(promisesBeforeServerStart).then(() => {
  app.listen(port, function () {
    console.log("Listening on port ".concat(port));
  });
});
