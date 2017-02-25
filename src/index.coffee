
semver = require "semver"

module.exports = (src, options = {}) ->

  unless src
    return console.log "missing src"

  unless dest = options.o
    return console.log "missing dest [-o]"

  unless version = options.v
    return console.log "missing version [-v]"

  versions = require "../versions"
  version = semver.maxSatisfying versions, version
  unless version
    return console.log "unsupported version: #{options.v}"

  process.argv = do ->
    args = process.argv.slice 0, 2
    args.push "-c"
    args.push "-b" if options.b
    args.push "-o", dest if dest
    args.concat src

  require("../versions/#{version}/lib/coffee-script/command").run()

