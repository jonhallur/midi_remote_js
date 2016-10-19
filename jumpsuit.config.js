var fs = require('fs')
var path = require('path')
var stylus = require('stylus')
var nib = require('nib')

var stylusEntry = path.resolve('src/app.styl')

module.exports = {
  styles: {
    extensions: ['.css', '.styl'],
    action: buildStyles
  },

  module: {
    loaders: [
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\S+)?$/,
        loader: 'file-loader?name=[hash].[ext]'
      }
    ]
  }
};

function buildStyles () {
  return new Promise(function (resolve, reject) {
    stylus.render(fs.readFileSync(stylusEntry, 'utf8'), {
      'include css': true,
      'hoist atrules': true,
      compress: process.env.NODE_ENV === 'production',
      paths: [path.resolve('src')],
      use: nib()
    }, function (err, css) {
      if (err) reject(err)
      else resolve(css)
    })
  })
}
