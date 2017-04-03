var fs = require('fs')
var path = require('path')

var ssbKeys = require('ssb-keys')

//get config as cli options after --, options before that are
//options to the command.
var argv = process.argv.slice(2)
var i = argv.indexOf('--')
argv = ~i ? argv.slice(0, i) : argv

// So we do not use .ssb/ config
var pangeaConfigPath = process.env.pangea_appname || 'pangea'
// We can use a new network key!
var config = require('ssb-config/inject')(pangeaConfigPath, {appKey: '7x0Mndy2LJl+gSvWm1QobTZo64jwpP6YuWo3IxbNzGA='})

var keys = ssbKeys.loadOrCreateSync(path.join(config.path, 'secret'))
if(keys.curve === 'k256')
  throw new Error('k256 curves are no longer supported,'+
                  'please delete' + path.join(config.path, 'secret'))

var manifestFile = path.join(config.path, 'manifest.json')

if (argv[0] == 'server') {
  var createSbot = require('scuttlebot')
    .use(require('scuttlebot/plugins/plugins'))
    .use(require('scuttlebot/plugins/master'))
    .use(require('scuttlebot/plugins/gossip'))
    .use(require('scuttlebot/plugins/friends'))
    .use(require('scuttlebot/plugins/replicate'))
    .use(require('ssb-blobs'))
    .use(require('scuttlebot/plugins/invite'))
    .use(require('scuttlebot/plugins/block'))
    .use(require('scuttlebot/plugins/local'))
    .use(require('scuttlebot/plugins/logging'))
    .use(require('scuttlebot/plugins/private'))

  config.keys = keys

  console.log('[PANGEA] Creating server...')
  var server = createSbot(config)

  // We save the manifest
  fs.writeFileSync(manifestFile, JSON.stringify(server.getManifest(), null, 2))
} else {
  // Text presenting pangea?
  // Print help :)
  console.log('Usage:')
  console.log('  start: start the server')
}
