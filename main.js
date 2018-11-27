var express = require('express'),
    path = require('path');
var chalk = require('chalk');
var freebirdApp = require('./app/server'),
    isDeveloping = process.env.NODE_ENV !== 'production',
    port = 8000,        // isDeveloping ? 3000 : process.env.PORT
    app = express();

if (isDeveloping) {
    var config = require('./webpack.config'),
        compiler = require('webpack')(config),
        middleware = require('webpack-dev-middleware')(compiler, {
        publicPath: config.output.publicPath,
        contentBase: 'src',
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    });

    app.use(middleware);
    app.use(require('webpack-hot-middleware')(compiler));
    app.use(express.static(__dirname + '/build'));
    app.get('*', function response(req, res) {
        res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'build/index.html')));
        res.end();
    });

} else {
    app.use(express.static(__dirname + '/build'));
    app.get('*', function response(req, res) {
        res.sendFile(path.join(__dirname, 'build/index.html'));
    });
}
app.set('port', process.env.PORT || port);

app.listen(port,function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.log(chalk.cyan('Express server started on port %s'), port)
  freebirdApp();
});


