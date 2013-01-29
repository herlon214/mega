var fs = require('fs')
var argv = require('optimist')
  .demand(1)
  .usage('USAGE: node example/download http://mega.co.nz/#!link!key')
  .argv


var mega = require('../lib/mega')

mega.file(argv._[0]).loadAttributes(function(err, file) {
  if (err) throw err

  console.log(file.name, file.size + 'B')

  var dl = file.download()
  dl.pipe(fs.createWriteStream(file.name), {end: false})

  var _p
  dl.on('progress', function (stats) {
    var p = Math.round(stats.bytesLoaded / stats.bytesTotal * 100)
    if (p != _p) {
      console.log(p + '%')
      _p = p
    }
  })

  dl.on('end', function() {
    console.log('Saved OK!')
  })
})