// craco.config.js
const path = require("path");
require("dotenv").config();

// Environment variable overrides
const config = {
  disableHotReload: process.env.DISABLE_HOT_RELOAD === "true",
  enableVisualEdits: process.env.REACT_APP_ENABLE_VISUAL_EDITS === "true",
  enableHealthCheck: process.env.ENABLE_HEALTH_CHECK === "true",
};

// Conditionally load visual editing modules only if enabled
let babelMetadataPlugin;
let setupDevServer;

if (config.enableVisualEdits) {
  babelMetadataPlugin = require("./plugins/visual-edits/babel-metadata-plugin");
  setupDevServer = require("./plugins/visual-edits/dev-server-setup");
}

// Conditionally load health check modules only if enabled
let WebpackHealthPlugin;
let setupHealthEndpoints;
let healthPluginInstance;

if (config.enableHealthCheck) {
  WebpackHealthPlugin = require("./plugins/health-check/webpack-health-plugin");
  setupHealthEndpoints = require("./plugins/health-check/health-endpoints");
  healthPluginInstance = new WebpackHealthPlugin();
}

const webpackConfig = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {

      // Disable hot reload completely if environment variable is set
      if (config.disableHotReload) {
        // Remove hot reload related plugins
        webpackConfig.plugins = webpackConfig.plugins.filter(plugin => {
          return !(plugin.constructor.name === 'HotModuleReplacementPlugin');
        });

        // Disable watch mode
        webpackConfig.watch = false;
        webpackConfig.watchOptions = {
          ignored: /.*/, // Ignore all files
        };
      } else {
        // Add ignored patterns to reduce watched directories
        webpackConfig.watchOptions = {
          ...webpackConfig.watchOptions,
          ignored: [
            '**/node_modules/**',
            '**/.git/**',
            '**/build/**',
            '**/dist/**',
            '**/coverage/**',
            '**/public/**',
          ],
        };
      }

      // Add health check plugin to webpack if enabled
      if (config.enableHealthCheck && healthPluginInstance) {
        webpackConfig.plugins.push(healthPluginInstance);
      }

      // Resolve ESM fullySpecified issues and alias roughjs paths used by Excalidraw
      webpackConfig.resolve = {
        ...(webpackConfig.resolve || {}),
        fullySpecified: false,
        alias: {
          ...(webpackConfig.resolve ? webpackConfig.resolve.alias : {}),
          'roughjs/bin/rough': require.resolve('roughjs/bin/rough.js'),
          'roughjs/bin/generator': require.resolve('roughjs/bin/generator.js'),
          'roughjs/bin/math': require.resolve('roughjs/bin/math.js'),
        },
      };

      // Silence invalid data-URL sourcemaps from specific vendors and exclude them from source-map-loader
      try {
        const problematicVendors = [
          /node_modules[\\\/]@excalidraw[\\\/]excalidraw[\\\/]/,
          /node_modules[\\\/]browser-fs-access[\\\/]/,
        ];

        // Add ignoreWarnings matcher (webpack 5)
        webpackConfig.ignoreWarnings = [
          ...(webpackConfig.ignoreWarnings || []),
          (warning) => {
            const message = (warning && warning.message) || '';
            const resource = warning && warning.module && warning.module.resource;
            return /Failed to parse source map/.test(message) && resource && problematicVendors.some((re) => re.test(resource));
          },
        ];

        // Exclude these vendors from source-map-loader rules
        if (webpackConfig.module && Array.isArray(webpackConfig.module.rules)) {
          const visit = (rules) => {
            (rules || []).forEach((rule) => {
              if (!rule) return;
              if (Array.isArray(rule.oneOf)) visit(rule.oneOf);
              const loaders = [];
              if (rule.loader) loaders.push(rule.loader);
              if (rule.use) {
                if (Array.isArray(rule.use)) rule.use.forEach((u) => loaders.push(u && (u.loader || u)));
                else loaders.push(rule.use.loader || rule.use);
              }
              const hasSourcemapLoader = loaders.some((l) => typeof l === 'string' && l.includes('source-map-loader'));
              if (hasSourcemapLoader) {
                rule.exclude = Array.from(new Set([...(Array.isArray(rule.exclude) ? rule.exclude : (rule.exclude ? [rule.exclude] : [])), ...problematicVendors]));
              }
            });
          };
          visit(webpackConfig.module.rules);
        }
      } catch (_) {
        // best-effort
      }

      return webpackConfig;
    },
  },
};

// Only add babel plugin if visual editing is enabled
if (config.enableVisualEdits) {
  webpackConfig.babel = {
    plugins: [babelMetadataPlugin],
  };
}

// Setup dev server with visual edits and/or health check
if (config.enableVisualEdits || config.enableHealthCheck) {
  webpackConfig.devServer = (devServerConfig) => {
    // Apply visual edits dev server setup if enabled
    if (config.enableVisualEdits && setupDevServer) {
      devServerConfig = setupDevServer(devServerConfig);
    }

    // Add health check endpoints if enabled
    if (config.enableHealthCheck && setupHealthEndpoints && healthPluginInstance) {
      const originalSetupMiddlewares = devServerConfig.setupMiddlewares;

      devServerConfig.setupMiddlewares = (middlewares, devServer) => {
        // Call original setup if exists
        if (originalSetupMiddlewares) {
          middlewares = originalSetupMiddlewares(middlewares, devServer);
        }

        // Setup health endpoints
        setupHealthEndpoints(devServer, healthPluginInstance);

        return middlewares;
      };
    }

    return devServerConfig;
  };
}

module.exports = webpackConfig;
