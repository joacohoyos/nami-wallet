const webpackConfig = require('./webpack.config');
module.exports = {
  // The Webpack config to use when compiling your react app for development or production.

  webpack: function (config, env) {
    const conf = { ...webpackConfig };
    delete conf.chromeExtensionBoilerplate
    // ...add your webpack config
    return {
      ...config,
      ...conf,
    };
  },
};
