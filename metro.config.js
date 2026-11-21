const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Allow Metro to handle ESM (.js files using import/export)
// Required for @react-navigation v7 which ships ESM-only builds
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_enableSymlinks = false;

// Transform ESM packages that Metro would otherwise choke on
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
};

module.exports = config;
