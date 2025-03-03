import createExpoWebpackConfigAsync from "@expo/webpack-config";

export default async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Adjust publicPath so assets are loaded from /app/
  config.output.publicPath = "/app/";
  return config;
}
