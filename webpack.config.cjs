const { createExpoWebpackConfigAsync } = require('@expo/webpack-config');

// Export the config function directly
module.exports = async function(env, argv) {
  // Create the default config
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Add polyfill for crypto
  if (!config.resolve) {
    config.resolve = {};
  }
  
  if (!config.resolve.fallback) {
    config.resolve.fallback = {};
  }
  
  // Polyfill crypto for web
  config.resolve.fallback.crypto = require.resolve('crypto-browserify');
  
  return config;
} 