#!/usr/bin/env node
let semver = require('semver')
let slurm = require('slurm')
let path = require('path')
let fs = require('fsx')
let os = require('os')

let args = slurm({
  m: true,
  o: {type: 'string'},
})

let src = args[0]
if (!src) fatal('missing input path')
if (!args.o) fatal('missing output path (-o)')

resolveVersion().then(coffeePath => {
  console.log('Resolved:', coffeePath)
  let name = /^coffee-?script/.exec(path.basename(coffeePath))[0]
  let cmd = require(path.join(coffeePath, 'lib', name, 'command'))
  let argv = process.argv.slice(0, 2)
  argv.push('-c', '-b', '-o', args.o)
  if (args.m) argv.push('-m')
  argv.push(src)
  process.argv = argv
  cmd.run()
}).catch(err => {
  console.error(err.stack)
  process.exit(1)
})

async function resolveVersion(range) {
  let pack = JSON.parse(fs.readFile('package.json'))
  let deps = pack.devDependencies

  range = deps['coffeescript'] || deps['coffee-script']
  if (!range) fatal('missing coffeescript dependency')

  if (!semver.validRange(range))
    fatal('invalid version: ' + range)

  let COFFEE_DIR = path.join(os.homedir(), '.coffee')
  fs.writeDir(COFFEE_DIR)

  let installed = fs.readDir(COFFEE_DIR)
  let versions = installed.map(name => /-([^-]+)$/.exec(name)[1])

  // Find an installed version.
  let version = semver.maxSatisfying(versions, range)
  if (version) {
    let name = installed[versions.indexOf(version)]
    return path.join(COFFEE_DIR, name)
  }

  // Resolve the missing version.
  let tarUrl = require('tar-url')
  let url = await tarUrl('coffeescript', range)
  if (!url) fatal('invalid version: ' + range)

  console.log('Installing:', url)

  // Install the missing version.
  let tarInstall = require('tar-install')
  let res = await tarInstall(url, COFFEE_DIR)
  let stderr = res.stderr.trim()
  if (stderr) console.log(stderr)
  return res.path
}

function fatal(msg) {
  console.log('Error:', msg)
  process.exit(1)
}
