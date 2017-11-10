// Generated by CoffeeScript 1.11.1
var semver;

semver = require("semver");

module.exports = function(src, options) {
  var dest, version, versions;
  if (options == null) {
    options = {};
  }
  if (!src) {
    return console.log("missing src");
  }
  if (!(dest = options.o)) {
    return console.log("missing dest [-o]");
  }
  if (!(version = options.v)) {
    return console.log("missing version [-v]");
  }
  versions = require("../versions");
  version = semver.maxSatisfying(versions, version);
  if (!version) {
    return console.log("unsupported version: " + options.v);
  }
  process.argv = (function() {
    var args;
    args = process.argv.slice(0, 2);
    args.push("-c");
    if (options.b) {
      args.push("-b");
    }
    if (dest) {
      args.push("-o", dest);
    }
    return args.concat(src);
  })();
  return require("../versions/" + version + "/lib/coffee-script/command").run();
};
