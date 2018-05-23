
module.exports = {
  entry: './src/index.js',
  target: 'node',
  output: {
    path: require('path').join(__dirname, '../dist'),
    filename: 'server.js'
  }
};
