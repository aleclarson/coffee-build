
childProcess = require "child_process"
semver = require "semver"

module.exports = (src, options = {}) ->

  dest = options.o
  bare = options.b
  version = options.v

  if not src
    console.log "missing src"
    return

  if not dest
    console.log "missing dest [-o]"
    return

  if not version
    console.log "missing version [-v]"
    return

  versions = require "../versions"
  version = semver.maxSatisfying versions, version
  if not version
    console.log "unsupported version: #{options.v}"
    return

  bin = "#{__dirname}/../versions/#{version}/bin/coffee"
  args = [bin, "-c"]
  bare and args.push "-b"
  dest and args.push "-o", dest
  args.push src

  spawn "node", args,
    cwd: process.cwd()
    encoding: "utf8"

#
# Helpers
#

trim = (str) -> str.replace /[\r\n]+$/, ""

spawn = (command, args, options) ->

  proc = childProcess.spawnSync command, args, options

  if proc.error
    throw proc.error

  if proc.stderr.length > 0
    throw Error trim proc.stderr

  return trim proc.stdout
