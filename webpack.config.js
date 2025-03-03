const { createExpoWebpackConfigAsync } = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ["your-module-name"],
      },
    },
    argv
  );

  // Set the public path correctly
  config.output.publicPath = "/app/";

  return config;
};
