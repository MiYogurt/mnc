// Generated by CoffeeScript 2.4.0
(function() {
  var check_mooc, compile, conf, cwd, e, fs, glob, path, spawn, watch;

  glob = require('glob-watcher');

  ({spawn} = require('child_process'));

  path = require('path');

  fs = require('fs');

  cwd = process.cwd();

  check_mooc = function() {
    return new Promise(function(resolve, reject) {
      var mooc;
      mooc = spawn("moonc", ["-v"]);
      mooc.stderr.on("data", reject);
      mooc.stdout.on("data", resolve);
    });
  };

  compile = function(file) {
    var moon;
    return moon = spawn('moonc', [file], {
      cwd: path.dirname(file),
      stdio: "inherit"
    });
  };

  watch = async function(folders) {
    var e, watcher;
    try {
      await check_mooc();
    } catch (error) {
      e = error;
      console.log("please install moonscript!");
      process.exit(-1);
    }
    watcher = glob(folders);
    watcher.on("add", compile);
    return watcher.on("change", compile);
  };

  conf = "";

  try {
    conf = fs.readFileSync(path.resolve(cwd, ".mnc")).toString('utf-8');
  } catch (error) {
    e = error;
    console.log("not font .mnc file");
    process.exit(-1);
  }

  if (conf === "") {
    console.log(".mnc file is empty");
    process.exit(-1);
  }

  watch(conf.split('\n'));

}).call(this);
