import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";

// Set the base URL path for the app
if (typeof window !== "undefined") {
  const pathname = window.location.pathname.replace(/\/+$/, "");
  if (pathname.startsWith("/app")) {
    // This ensures all routing happens relative to the /app/ base path
    window.__EXPO_ROUTER_BASE_PATH__ = "/app";
  }
}

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
