const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Disable React Native codegen to avoid parsing errors
config.transformer.babelTransformerPath = require.resolve(
  '@expo/metro-config/build/babel-transformer'
);

module.exports = withNativeWind(config, { input: './global.css' });
