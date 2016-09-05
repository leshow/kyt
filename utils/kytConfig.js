
// Merges base and user kyt config

const path = require('path');
const shell = require('shelljs');
const baseConfig = require('./../config/kyt.base.config');
const merge = require('ramda').merge;
const { userRootPath, userKytConfigPath } = require('./paths')();

// Parses client and server URLs
// Adding hostname and ports to the config
const updateURLs = (config) => {
  const logger = console;
  const clientArr = config.clientURL.match('^(.*)://([A-Za-z0-9\-\.]+):([0-9]+)$');
  const serverArr = config.serverURL.match('^(.*)://([A-Za-z0-9\-\.]+):([0-9]+)$');

  if (clientArr === null || clientArr.length < 4) {
    logger.error('❌  kyt config clientURL is malformed.');
    process.exit(1);
  }
  if (serverArr === null || serverArr.length < 4) {
    logger.error('❌  kyt config serverURL is malformed.');
    process.exit(1);
  }
  config.clientHostname = clientArr[2];
  config.serverHostname = serverArr[2];
  config.clientPort = clientArr[3];
  config.serverPort = serverArr[3];

  return config;
}

module.exports = (optionalConfig) => {
  if (global.config) return;

  const userConfigPath = optionalConfig
    ? path.join(userRootPath, optionalConfig)
    : userKytConfigPath;
  let config;
  const logger = console;

  // Add base config option for productionPublicPath
  baseConfig.productionPublicPath = '/assets/';

  // Find user config
  if (shell.test('-f', userConfigPath)) {
    try {
      logger.info(`Using kyt config at ${userConfigPath}`);
      config = require(userConfigPath); // eslint-disable-line global-require
    } catch (error) {
      logger.error('❌  Error loading your kyt.config.js:', error);
      process.exit(1);
    }
  }

  config = merge(baseConfig, config);

  // Create default modify function
  if (typeof config.modifyWebpackConfig !== 'function') {
    config.modifyWebpackConfig = (webpackConfig) => webpackConfig;
  }
  config = updateURLs(config);
  // In case `reactHotLoader` is undefined, make it a boolean
  config.reactHotLoader = !!config.reactHotLoader;
  global.config = Object.freeze(config);
};
