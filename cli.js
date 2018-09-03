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

resolveVersion().then(cmd => {
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

  let coffeeDir = path.join(os.homedir(), '.coffee')
  fs.writeDir(coffeeDir)

  // Get pre-installed versions.
  let installed = [], versions = []
  fs.readDir(coffeeDir).forEach(name => {
    let match = /-([^-]+)$/.exec(name)
    if (match) {
      installed.push(name)
      versions.push(match[1])
    }
  })

  // Find an installed version.
  let version = semver.maxSatisfying(versions, range)

  // Install missing versions.
  let coffeePath
  if (version) {
    let name = installed[versions.indexOf(version)]
    coffeePath = path.join(coffeeDir, name)
  }
  else {
    let tarUrl = require('tar-url')
    let url = await tarUrl('coffeescript', range)
    if (!url) fatal('invalid version: ' + range)

    console.log('Installing:', url)

    // Install the missing version.
    let tarInstall = require('tar-install')
    let res = await tarInstall(url, coffeeDir)

    let stderr = res.stderr.trim()
    if (stderr) console.log(stderr)

    coffeePath = res.path
    version = JSON.parse(fs.readFile(coffeePath + '/package.json')).version
  }

  console.log('Resolved:', coffeePath)
  let name = semver.gte(version, '2.0.0') ? 'coffeescript' : 'coffee-script'
  return require(path.join(coffeePath, 'lib', name, 'command'))
}

function fatal(msg) {
  console.log('Error:', msg)
  process.exit(1)
}
