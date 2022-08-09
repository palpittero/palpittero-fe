const path = require("path");

module.exports = {
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@/": path.resolve(__dirname, "../src/"),
    };
    config.resolve.extensions.push(".ts", ".tsx", ".js", ".vue");
    return config;
  },
};