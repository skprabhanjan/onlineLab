var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var app = express();
var process = require('process');
var path = require("path");
var all_files = [];
var exec = require('child_process').exec;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'});
});

router.post("/upload_files", function (req, res) {
  var multiparty = require('multiparty');
  var form = new multiparty.Form();
  form.parse(req, function (err, fields, files) {
    var img = files.images[0];
    console.log(fields);
    var current_srn = fields.srn[0];
    var current_assignment = fields.assignment[0];
    var fs = require("fs");
    fs.readFile(img.path, function (err, data) {
      var upload_path = path.join(__dirname, "../uploads/");
      var file_path = upload_path + current_srn + "/" + current_assignment + "/" + img.originalFilename;
      if (!fs.existsSync(upload_path + current_srn)) {
        fs.mkdirSync(upload_path + current_srn);
      }
      process.chdir(upload_path + current_srn);
      if (!fs.existsSync(upload_path + current_srn + "/" + current_assignment)) {
        fs.mkdirSync(upload_path + current_srn + "/" + current_assignment);
      }
      fs
        .writeFile(file_path, data, function (error) {
          if (error) 
            console.log(error);
          }
        );
    });
  });
  res.redirect('http://localhost:8080/');
});

router.get('/check_uploads', function (req, res, next) {
  var current_srn = req.query.srn;
  var current_assignment = req.query.assignment;
  var upload_path = (path.join(__dirname, "../uploads/"));
  var fs = require("fs");
  all_files = [];
  fs.readdir(upload_path + current_srn, (err, files) => {
    if (files != undefined) {
      fs.readdir(upload_path + current_srn + "/" + current_assignment, (err, files) => {
        if (files != undefined) {
          files
            .forEach(function (file) {
              all_files.push(file);
            })
          res.send(all_files);
        } else {
          res.send(all_files);
        }
      });
    } else {
      res.send(all_files);
    }
  });

});

router.get('/compile', function (req, res, next) {
  var srn = req.query.srn;
  var assignment = req.query.assignment;
  var fs = require("fs");
  var compiler_results = [];
  var async_count = 0;
  var path_to_folder = path.join(__dirname, "../uploads/") + srn + "/" + assignment;
  fs.readdir(path_to_folder, (err, files) => {
    if (files != undefined) {
      files
        .forEach(function (value) {
          var file_to_compile = path_to_folder + "/" + value;
          exec("gcc " + file_to_compile, function (error, stdout, stderr) {
            if (!error) {
              //  var obj = {index: "Complied"};  compiler_results.push(obj);
              var obj = {
                file: value,
                result: "Compiled"
              };
              compiler_results.push(obj);
              async_count += 1;
            } else {
              //  var obj = {index: stderr}; compiler_results.push(obj);
              var obj = {
                file: value,
                result: stderr
              };
              compiler_results.push(obj);
              async_count += 1;
            }
            if (async_count == files.length) {
              console.log(compiler_results);
              res.send(compiler_results);
            }
          });
        })
    } else {
      res.send([]);
    }

  })
  // exec("gcc ", function(error, stdout, stderr) {       console.log(stderr); });
})

router.get('/remove_file', function (req, res, next) {
  var current_srn = req.query.srn;
  var current_assignment = req.query.assignment;
  var file_index = req.query.file;
  var fs = require("fs");
  var upload_path = path.join(__dirname, "../uploads/") + current_srn + "/" + current_assignment + "/" + all_files[file_index];
  fs.unlinkSync(upload_path);
  all_files = [];
  fs.readdir(path.join(__dirname, "../uploads/") + current_srn, (err, files) => {
    if (files != undefined) {
      fs.readdir(path.join(__dirname, "../uploads/") + current_srn + "/" + current_assignment, (err, files) => {
        if (files != undefined) {
          files
            .forEach(function (file) {
              all_files.push(file);
            })
          res.send(all_files);
        } else {
          res.send(all_files);
        }
      });
    } else {
      res.send(all_files);
    }
  });

})

module.exports = router;
